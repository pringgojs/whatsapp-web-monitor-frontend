<template>
  <div
    class="max-w-3xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg"
  >
    <nav
      class="mb-6 text-sm text-gray-500 dark:text-gray-300 flex items-center gap-1"
    >
      <router-link to="/" class="text-primary-600 hover:underline"
        >Home</router-link
      >
      <span>/</span>
      <span>Clients</span>
    </nav>
    <div
      v-if="showQRModal"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 min-w-[300px] text-center relative"
      >
        <h3 class="text-lg font-semibold mb-4">Scan WhatsApp QR</h3>
        <div v-if="qrLoading" class="text-gray-500 dark:text-gray-300 mb-4">
          Loading QR...
        </div>
        <div v-else-if="qrImage" class="flex justify-center mb-4">
          <img :src="qrImage" alt="QR Code" class="max-w-xs mx-auto" />
        </div>
        <div v-else class="text-red-500 mb-4">QR not available.</div>
        <button
          @click="closeQRModal"
          class="mt-2 px-4 py-2 rounded bg-primary-600 text-white font-semibold hover:bg-primary-700 transition"
        >
          Tutup
        </button>
      </div>
    </div>
    <h1 class="text-2xl font-bold mb-4">Daftar Client WhatsApp Terdaftar</h1>
    <div class="flex flex-wrap gap-2 mb-4">
      <button
        @click="fetchClients"
        class="px-4 py-2 bg-emerald-600 text-white rounded font-semibold hover:bg-emerald-700 transition"
      >
        Refresh
      </button>
      <button
        @click="showAddClient = true"
        class="px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
      >
        Tambah Client
      </button>
    </div>
    <div
      v-if="showAddClient"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 min-w-[300px] text-center relative"
      >
        <h3 class="text-lg font-semibold mb-4">Tambah Client</h3>
        <form @submit.prevent="addClient" class="flex flex-col gap-3 mt-2">
          <input
            v-model="newClientId"
            type="text"
            placeholder="Client ID"
            required
            class="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <div class="flex gap-2 justify-center">
            <button
              type="submit"
              class="px-4 py-2 bg-emerald-600 text-white rounded font-semibold hover:bg-emerald-700 transition"
            >
              Tambah
            </button>
            <button
              type="button"
              @click="showAddClient = false"
              class="px-4 py-2 bg-red-500 text-white rounded font-semibold hover:bg-red-700 transition"
            >
              Batal
            </button>
          </div>
        </form>
        <div v-if="addError" class="text-red-500 mt-2">{{ addError }}</div>
      </div>
    </div>
    <div v-if="loading" class="text-gray-500 dark:text-gray-300 mt-4">
      Memuat data...
    </div>
    <div v-if="error" class="text-red-500 mt-4">{{ error }}</div>
    <div v-if="clients.length">
      <div class="overflow-x-auto rounded-lg shadow mt-4">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th
                class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200"
              >
                #
              </th>
              <th
                class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200"
              >
                Client ID
              </th>
              <th
                class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200"
              >
                Status
              </th>
              <th
                class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody
            class="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800"
          >
            <tr v-for="(client, idx) in clients" :key="client">
              <td class="px-4 py-2">{{ idx + 1 }}</td>
              <td class="px-4 py-2">
                <span v-if="editClientId !== client">{{ client }}</span>
                <input
                  v-else
                  v-model="editClientIdInput"
                  type="text"
                  :disabled="
                    statuses[client] === 'ready' ||
                    statuses[client] === 'connected'
                  "
                  class="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </td>
              <td class="px-4 py-2">
                <span v-if="statuses[client]">{{ statuses[client] }}</span>
                <span v-else class="text-gray-400">Memuat...</span>
              </td>
              <td class="px-4 py-2 flex flex-wrap gap-1">
                <router-link
                  :to="{ name: 'ClientDetail', params: { clientId: client } }"
                  class="bg-gray-800 text-white rounded px-2 py-1 font-semibold hover:bg-emerald-600 transition"
                  >Detail</router-link
                >
                <button
                  v-if="editClientId !== client"
                  @click="startEdit(client)"
                  :disabled="
                    statuses[client] === 'ready' ||
                    statuses[client] === 'connected'
                  "
                  class="px-2 py-1 bg-yellow-500 text-white rounded font-semibold hover:bg-yellow-600 disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  Edit
                </button>
                <button
                  v-else
                  @click="saveEdit(client)"
                  :disabled="
                    statuses[client] === 'ready' ||
                    statuses[client] === 'connected'
                  "
                  class="px-2 py-1 bg-emerald-600 text-white rounded font-semibold hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  Simpan
                </button>
                <button
                  v-if="editClientId === client"
                  @click="cancelEdit"
                  class="px-2 py-1 bg-gray-500 text-white rounded font-semibold hover:bg-gray-700 transition"
                >
                  Batal
                </button>
                <button
                  @click="confirmDelete(client)"
                  class="px-2 py-1 bg-red-500 text-white rounded font-semibold hover:bg-red-700 transition"
                >
                  Hapus
                </button>
                <button
                  v-if="
                    statuses[client] === 'ready' ||
                    statuses[client] === 'connected'
                  "
                  @click="confirmDisconnect(client, 'logout')"
                  class="px-2 py-1 bg-orange-500 text-white rounded font-semibold hover:bg-orange-600 transition"
                >
                  Logout (QR Baru)
                </button>
                <button
                  v-if="
                    statuses[client] === 'ready' ||
                    statuses[client] === 'connected'
                  "
                  @click="confirmDisconnect(client, 'destroy')"
                  class="px-2 py-1 bg-gray-700 text-white rounded font-semibold hover:bg-gray-900 transition"
                >
                  Putus Koneksi (Session Tetap)
                </button>
                <button
                  v-if="
                    statuses[client] === 'disconnected' ||
                    statuses[client] === 'destroyed'
                  "
                  @click="reconnectClient(client)"
                  class="px-2 py-1 bg-green-600 text-white rounded font-semibold hover:bg-green-800 transition"
                >
                  Reconnect
                </button>
                <button
                  v-if="statuses[client] === 'qr'"
                  @click="showQR(client)"
                  class="px-2 py-1 bg-blue-600 text-white rounded font-semibold hover:bg-blue-800 transition"
                >
                  Scan QR
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div
      v-else-if="!loading && !error"
      class="text-gray-500 dark:text-gray-400 mt-8 text-center"
    >
      Belum ada client terdaftar.
    </div>
  </div>
  <div
    v-if="showDeleteConfirm"
    class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 min-w-[300px] text-center relative"
    >
      <h3 class="text-lg font-semibold mb-4">Konfirmasi Hapus Client</h3>
      <p class="mb-4">{{ deleteWarning }}</p>
      <div class="flex gap-2 justify-center">
        <button
          @click="doDeleteClient"
          class="px-4 py-2 bg-red-500 text-white rounded font-semibold hover:bg-red-700 transition"
        >
          Ya, Hapus
        </button>
        <button
          @click="showDeleteConfirm = false"
          class="px-4 py-2 bg-gray-500 text-white rounded font-semibold hover:bg-gray-700 transition"
        >
          Batal
        </button>
      </div>
    </div>
  </div>
  <div
    v-if="showDisconnectConfirm"
    class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 min-w-[300px] text-center relative"
    >
      <h3 class="text-lg font-semibold mb-4">Konfirmasi Disconnect Client</h3>
      <p class="mb-4">{{ disconnectWarning }}</p>
      <div class="flex gap-2 justify-center">
        <button
          @click="doDisconnectClient"
          class="px-4 py-2 bg-orange-500 text-white rounded font-semibold hover:bg-orange-600 transition"
        >
          Ya, Disconnect
        </button>
        <button
          @click="showDisconnectConfirm = false"
          class="px-4 py-2 bg-gray-500 text-white rounded font-semibold hover:bg-gray-700 transition"
        >
          Batal
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { API_BASE_URL } from "../config";

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
const showQRModal = ref(false);
const qrImage = ref("");
const qrLoading = ref(false);
const pollingQR = ref(false);
const currentQRClient = ref("");

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const fetchClients = async () => {
  loading.value = true;
  error.value = "";
  try {
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      headers: { ...getAuthHeaders() },
    });
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
      `${API_BASE_URL}/sessions/${clientId}/status`,
      { headers: { ...getAuthHeaders() } }
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
      `${API_BASE_URL}/sessions/${newClientId.value}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
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
  await fetch(`${API_BASE_URL}/sessions/${clientId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
  });
};

const deleteClient = async (clientId, silent = false) => {
  try {
    const response = await fetch(`${API_BASE_URL}/clients/${clientId}`, {
      method: "DELETE",
      headers: { ...getAuthHeaders() },
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
        ? `${API_BASE_URL}/clients/${clientToDisconnect.value}/destroy`
        : `${API_BASE_URL}/clients/${clientToDisconnect.value}/disconnect`;
    await fetch(endpoint, { method: "POST", headers: { ...getAuthHeaders() } });
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
    await fetch(`${API_BASE_URL}/sessions/${clientId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
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

const showQR = async (clientId) => {
  showQRModal.value = true;
  qrImage.value = "";
  qrLoading.value = true;
  currentQRClient.value = clientId;
  await fetchQR(clientId);
  startQRStatusPolling(clientId);
};

const closeQRModal = () => {
  showQRModal.value = false;
  qrImage.value = "";
  qrLoading.value = false;
  pollingQR.value = false;
  currentQRClient.value = "";
};

const fetchQR = async (clientId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions/${clientId}/qr`, {
      headers: { ...getAuthHeaders() },
    });
    const data = await response.json();
    if (response.ok && data.qrImage) {
      qrImage.value = data.qrImage;
    } else {
      qrImage.value = "";
      if (data.error) {
        console.warn("QR error:", data.error);
      }
    }
  } catch (e) {
    qrImage.value = "";
    console.warn("QR fetch error:", e);
  } finally {
    qrLoading.value = false;
  }
};

const startQRStatusPolling = (clientId) => {
  pollingQR.value = true;
  const poll = async () => {
    if (!pollingQR.value || currentQRClient.value !== clientId) return;
    await fetchStatus(clientId);
    const status = statuses.value[clientId];
    if (status === "ready" || status === "connected") {
      closeQRModal();
      fetchClients();
    } else if (status === "qr") {
      await fetchQR(clientId);
      setTimeout(poll, 2000);
    } else {
      setTimeout(poll, 2000);
    }
  };
  poll();
};

onMounted(fetchClients);
watch(clients, (newClients) => {
  newClients.forEach(fetchStatus);
});
</script>
