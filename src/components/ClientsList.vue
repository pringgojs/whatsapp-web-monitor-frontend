<template>
  <div class="clients-container">
    <h1>Daftar Client WhatsApp Terdaftar</h1>
    <button @click="fetchClients" class="refresh-btn">Refresh</button>
    <button @click="showAddClient = true" class="add-btn">Tambah Client</button>
    <div v-if="showAddClient" class="modal">
      <div class="modal-content">
        <h3>Tambah Client</h3>
        <form @submit.prevent="addClient">
          <input
            v-model="newClientId"
            type="text"
            placeholder="Client ID"
            required
          />
          <button type="submit">Tambah</button>
          <button type="button" @click="showAddClient = false">Batal</button>
        </form>
        <div v-if="addError" class="error">{{ addError }}</div>
      </div>
    </div>
    <div v-if="loading" class="loading">Memuat data...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <table v-if="clients.length" class="clients-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Client ID</th>
          <th>Status</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(client, idx) in clients" :key="client">
          <td>{{ idx + 1 }}</td>
          <td>
            <span v-if="editClientId !== client">{{ client }}</span>
            <input
              v-else
              v-model="editClientIdInput"
              type="text"
              :disabled="
                statuses[client] === 'ready' || statuses[client] === 'connected'
              "
            />
          </td>
          <td>
            <span v-if="statuses[client]">{{ statuses[client] }}</span>
            <span v-else class="loading">Memuat...</span>
          </td>
          <td>
            <button
              v-if="editClientId !== client"
              @click="startEdit(client)"
              :disabled="
                statuses[client] === 'ready' || statuses[client] === 'connected'
              "
            >
              Edit
            </button>
            <button
              v-else
              @click="saveEdit(client)"
              :disabled="
                statuses[client] === 'ready' || statuses[client] === 'connected'
              "
            >
              Simpan
            </button>
            <button v-if="editClientId === client" @click="cancelEdit">
              Batal
            </button>
            <button @click="confirmDelete(client)" class="delete-btn">
              Hapus
            </button>
            <button
              v-if="
                statuses[client] === 'ready' || statuses[client] === 'connected'
              "
              @click="confirmDisconnect(client, 'logout')"
              class="disconnect-btn"
            >
              Logout (QR Baru)
            </button>
            <button
              v-if="
                statuses[client] === 'ready' || statuses[client] === 'connected'
              "
              @click="confirmDisconnect(client, 'destroy')"
              class="disconnect-btn destroy"
            >
              Putus Koneksi (Session Tetap)
            </button>
            <button
              v-if="
                statuses[client] === 'disconnected' ||
                statuses[client] === 'destroyed'
              "
              @click="reconnectClient(client)"
              class="reconnect-btn"
            >
              Reconnect
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else-if="!loading && !error">Belum ada client terdaftar.</div>
  </div>
  <div v-if="showDeleteConfirm" class="modal">
    <div class="modal-content">
      <h3>Konfirmasi Hapus Client</h3>
      <p>{{ deleteWarning }}</p>
      <button @click="doDeleteClient">Ya, Hapus</button>
      <button @click="showDeleteConfirm = false">Batal</button>
    </div>
  </div>
  <div v-if="showDisconnectConfirm" class="modal">
    <div class="modal-content">
      <h3>Konfirmasi Disconnect Client</h3>
      <p>{{ disconnectWarning }}</p>
      <button @click="doDisconnectClient">Ya, Disconnect</button>
      <button @click="showDisconnectConfirm = false">Batal</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

const clients = ref([]);
const loading = ref(false);
const error = ref("");
const statuses = ref({});
const showAddClient = ref(false);
const newClientId = ref("");
const addError = ref("");
const editClientId = ref("");
const editClientIdInput = ref("");
const showDeleteConfirm = ref(false);
const clientToDelete = ref("");
const deleteWarning = ref("");
const showDisconnectConfirm = ref(false);
const clientToDisconnect = ref("");
const disconnectWarning = ref("");
const disconnectType = ref("logout");
const reconnectingClients = ref({}); // key: clientId, value: true/false

const fetchClients = async () => {
  loading.value = true;
  error.value = "";
  try {
    const response = await fetch("http://localhost:3000/sessions");
    const data = await response.json();
    if (response.ok && data.sessions) {
      clients.value = data.sessions;
      // Fetch status untuk setiap client
      data.sessions.forEach(fetchStatus);
    } else {
      error.value = data.error || "Gagal memuat data client.";
    }
  } catch (e) {
    error.value = "Gagal memuat data client.";
  } finally {
    loading.value = false;
  }
};

const fetchStatus = async (clientId) => {
  try {
    const response = await fetch(
      `http://localhost:3000/sessions/${clientId}/status`
    );
    const data = await response.json();
    if (response.ok && data.status) {
      statuses.value[clientId] = data.status;
    } else {
      statuses.value[clientId] = data.status || "unknown";
    }
  } catch (e) {
    statuses.value[clientId] = "unknown";
  }
};

const addClient = async () => {
  addError.value = "";
  if (!newClientId.value) return;
  try {
    const response = await fetch(
      `http://localhost:3000/sessions/${newClientId.value}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await response.json();
    if (response.ok) {
      showAddClient.value = false;
      newClientId.value = "";
      fetchClients();
    } else {
      addError.value = data.error || "Gagal menambah client.";
    }
  } catch (e) {
    addError.value = "Gagal menambah client.";
  }
};

const startEdit = (client) => {
  editClientId.value = client;
  editClientIdInput.value = client;
};

const saveEdit = async (oldClientId) => {
  if (!editClientIdInput.value || editClientIdInput.value === oldClientId) {
    editClientId.value = "";
    return;
  }
  if (
    statuses.value[oldClientId] === "ready" ||
    statuses.value[oldClientId] === "connected"
  ) {
    error.value = "Tidak bisa edit client yang sedang terhubung.";
    return;
  }
  try {
    await deleteClient(oldClientId, true);
    await addClientById(editClientIdInput.value);
    editClientId.value = "";
    fetchClients();
  } catch (e) {
    error.value = "Gagal mengedit client.";
  }
};

const cancelEdit = () => {
  editClientId.value = "";
};

const addClientById = async (clientId) => {
  await fetch(`http://localhost:3000/sessions/${clientId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
};

const deleteClient = async (clientId, silent = false) => {
  try {
    const response = await fetch(`http://localhost:3000/clients/${clientId}`, {
      method: "DELETE",
    });
    if (!silent) fetchClients();
  } catch (e) {
    if (!silent) error.value = "Gagal menghapus client.";
  }
};

const confirmDelete = (client) => {
  clientToDelete.value = client;
  if (
    statuses.value[client] === "ready" ||
    statuses.value[client] === "connected"
  ) {
    deleteWarning.value =
      "Client sedang terhubung. Menghapus client akan mendisconnect WhatsApp. Lanjutkan?";
  } else {
    deleteWarning.value = "Yakin ingin menghapus client ini?";
  }
  showDeleteConfirm.value = true;
};

const doDeleteClient = async () => {
  await deleteClient(clientToDelete.value);
  showDeleteConfirm.value = false;
  clientToDelete.value = "";
};

const confirmDisconnect = (client, type = "logout") => {
  clientToDisconnect.value = client;
  disconnectType.value = type;
  disconnectWarning.value =
    type === "logout"
      ? "Yakin ingin logout client ini? WhatsApp akan logout dan harus scan QR lagi."
      : "Yakin ingin memutus koneksi client ini? Session tetap ada, tidak perlu scan QR ulang.";
  showDisconnectConfirm.value = true;
};

const doDisconnectClient = async () => {
  try {
    const endpoint =
      disconnectType.value === "destroy"
        ? `http://localhost:3000/clients/${clientToDisconnect.value}/destroy`
        : `http://localhost:3000/clients/${clientToDisconnect.value}/disconnect`;
    await fetch(endpoint, { method: "POST" });
    fetchClients();
  } catch (e) {
    error.value = "Gagal disconnect client.";
  } finally {
    showDisconnectConfirm.value = false;
    clientToDisconnect.value = "";
  }
};

const reconnectClient = async (clientId) => {
  reconnectingClients.value[clientId] = true;
  try {
    await fetch(`http://localhost:3000/sessions/${clientId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    // Mulai polling status hingga berubah dari destroyed/disconnected/initializing
    const pollStatus = async (attempt = 0) => {
      await fetchStatus(clientId);
      const status = statuses.value[clientId];
      if (
        (status === "destroyed" ||
          status === "disconnected" ||
          status === "unknown" ||
          status === "initializing") &&
        attempt < 30 // max 1 menit
      ) {
        setTimeout(() => pollStatus(attempt + 1), 2000);
      } else {
        reconnectingClients.value[clientId] = false;
        fetchClients();
      }
    };
    pollStatus();
  } catch (e) {
    error.value = "Gagal reconnect client.";
    reconnectingClients.value[clientId] = false;
  }
};

onMounted(fetchClients);
watch(clients, (newClients) => {
  newClients.forEach(fetchStatus);
});
</script>

<style scoped>
.clients-container {
  max-width: 700px;
  margin: 40px auto;
  padding: 2rem;
  background: var(--dashboard-bg, #fff);
  border-radius: 10px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
}
.refresh-btn {
  margin-bottom: 1rem;
  padding: 0.5rem 1.2rem;
  background: #42b983;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.refresh-btn:hover {
  background: #369870;
}
.add-btn {
  margin-bottom: 1rem;
  padding: 0.5rem 1.2rem;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
  margin-right: 0.5rem;
}
.add-btn:hover {
  background: #0056b3;
}
.clients-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
.clients-table th,
.clients-table td {
  border: 1px solid #eee;
  padding: 0.7rem 1rem;
  text-align: left;
}
.clients-table th {
  background: #f9f9f9;
}
.loading {
  color: #888;
  margin-top: 1rem;
}
.error {
  color: #e74c3c;
  margin-top: 1rem;
}
.delete-btn {
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.3rem 0.8rem;
  font-weight: bold;
  cursor: pointer;
  margin-left: 0.5rem;
}
.delete-btn:hover {
  background: #c0392b;
}
.disconnect-btn {
  background: #f39c12;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.3rem 0.8rem;
  font-weight: bold;
  cursor: pointer;
  margin-left: 0.5rem;
}
.disconnect-btn.destroy {
  background: #6c757d;
}
.disconnect-btn.destroy:hover {
  background: #495057;
}
.disconnect-btn:hover {
  background: #b9770e;
}
.reconnect-btn {
  background: #27ae60;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.3rem 0.8rem;
  font-weight: bold;
  cursor: pointer;
  margin-left: 0.5rem;
}
.reconnect-btn[disabled],
.reconnect-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.reconnect-btn:hover {
  background: #219150;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  min-width: 300px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.15);
}
@media (prefers-color-scheme: dark) {
  .clients-container {
    background: var(--dashboard-bg-dark, #23272f);
    color: #fff;
  }
  .clients-table th {
    background: #23272f;
    color: #fff;
  }
  .clients-table td {
    border-color: #444;
  }
  .modal-content {
    background: #23272f;
    color: #fff;
  }
}
</style>
