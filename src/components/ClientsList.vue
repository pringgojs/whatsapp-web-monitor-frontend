<template>
  <div
    class="max-w-3xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl"
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
        class="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 min-w-[340px] w-full max-w-xs flex flex-col items-center border border-gray-100 dark:border-gray-800"
      >
        <button
          @click="closeQRModal"
          class="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
          aria-label="Tutup"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h3
          class="text-xl font-bold text-gray-700 dark:text-gray-100 mb-4 mt-2 text-center tracking-tight"
        >
          Scan QR WhatsApp
        </h3>
        <div
          v-if="qrLoading"
          class="flex flex-col items-center gap-2 mb-4 mt-6"
        >
          <svg
            class="animate-spin h-7 w-7 text-emerald-500"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            ></path>
          </svg>
          <span class="text-gray-500 dark:text-gray-300 text-sm"
            >Memuat QR...</span
          >
        </div>
        <div v-else-if="qrImage" class="flex flex-col items-center mb-4">
          <div
            class="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm"
          >
            <img
              :src="qrImage"
              alt="QR Code"
              class="w-56 h-56 object-contain"
            />
          </div>
          <span
            class="mt-3 text-gray-500 dark:text-gray-300 text-xs text-center"
            >Scan QR ini di aplikasi WhatsApp Anda untuk login.</span
          >
        </div>
        <div v-else class="flex flex-col items-center gap-2 mb-4 mt-6">
          <svg
            class="w-8 h-8 text-red-400"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="2"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span class="text-red-500 text-sm">QR tidak tersedia.</span>
        </div>
        <button
          @click="closeQRModal"
          class="mt-6 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition text-base shadow focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          Tutup
        </button>
      </div>
    </div>
    <div class="flex items-center justify-between mb-4">
      <h1
        class="text-xl font-semibold text-gray-700 dark:text-gray-200 tracking-tight"
      >
        Clients
      </h1>
      <div class="flex gap-2">
        <button
          @click="fetchClients"
          class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 transition text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
          aria-label="Refresh"
          type="button"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4 4v5h.582M20 20v-5h-.581M5 9A7 7 0 0112 5a7 7 0 017 7c0 1.657-.672 3.157-1.764 4.243M19 15a7 7 0 01-7 4 7 7 0 01-7-7c0-1.657.672-3.157 1.764-4.243"
            />
          </svg>
          Refresh
        </button>
        <button
          @click="showAddClient = true"
          class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50 transition text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
          aria-label="Tambah Client"
          type="button"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Tambah Client
        </button>
      </div>
    </div>
    <div
      v-if="showAddClient"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div
        class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 min-w-[340px] w-full max-w-sm text-center border border-gray-100 dark:border-gray-800 relative flex flex-col gap-4"
      >
        <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-100 mb-2">
          Tambah Client
        </h3>
        <form @submit.prevent="addClient" class="flex flex-col gap-3 mt-2">
          <PrelineInput
            v-model="newClientId"
            type="text"
            placeholder="Client ID"
            :error="addError"
            :disabled="loading"
            class="w-full"
            required
          />
          <div class="flex gap-2 justify-center mt-2">
            <button
              type="submit"
              class="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 transition text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:opacity-60 disabled:cursor-not-allowed"
              :disabled="loading"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Tambah
            </button>
            <button
              type="button"
              @click="showAddClient = false"
              class="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-white text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Batal
            </button>
          </div>
        </form>
        <div v-if="addError" class="text-red-500 mt-2 text-sm">
          {{ addError }}
        </div>
      </div>
    </div>
    <div v-if="loading" class="text-gray-500 dark:text-gray-300 mt-4">
      Memuat data...
    </div>
    <div v-if="error" class="text-red-500 mt-4">{{ error }}</div>
    <div v-if="clients.length">
      <div class="rounded-xl shadow mt-4">
        <div class="flex flex-col w-full gap-0.5">
          <div
            class="grid grid-cols-5 bg-gray-50 dark:bg-gray-800 rounded-t-xl font-semibold text-gray-700 dark:text-gray-200 sticky top-0 z-10"
          >
            <div class="px-4 py-3">#</div>
            <div class="px-4 py-3">Client ID</div>
            <div class="px-4 py-3">Status</div>
            <div class="px-4 py-3">Nomor WhatsApp</div>
            <div class="px-4 py-3"></div>
          </div>
          <div
            v-for="(client, idx) in clients"
            :key="client"
            :class="[
              'grid grid-cols-5 items-center mb-1',
              editClientId === client
                ? '!bg-transparent !ring-0 !shadow-none !border-0 !p-0 !m-0 !rounded-none'
                : 'bg-white dark:bg-gray-900 hover:bg-emerald-50 dark:hover:bg-gray-800 transition-all rounded-lg shadow-sm',
            ]"
            :style="
              editClientId === client
                ? 'border:none;background:transparent;box-shadow:none;padding:0;margin:0;'
                : ''
            "
          >
            <div
              :class="
                editClientId === client
                  ? '!px-0 !py-0'
                  : 'px-4 py-2 text-gray-900 dark:text-white'
              "
            >
              {{ idx + 1 }}
            </div>
            <div
              :class="[
                editClientId === client
                  ? '!bg-transparent !border-0 !p-0 !shadow-none'
                  : 'px-4 py-2 text-gray-900 dark:text-white',
              ]"
              :style="
                editClientId === client
                  ? 'all:unset; background:transparent; border:none; box-shadow:none; padding:0; margin:0;'
                  : ''
              "
            >
              <span v-if="editClientId !== client">{{ client }}</span>
              <PrelineInput
                v-else
                v-model="editClientIdInput"
                type="text"
                :disabled="
                  statuses[client] === 'ready' ||
                  statuses[client] === 'connected'
                "
                class="w-full border border-emerald-400 dark:border-emerald-600 focus:ring-2 focus:ring-emerald-400 rounded-lg px-3 py-1.5 text-sm bg-transparent shadow-none transition placeholder-gray-400 !m-0"
                placeholder="Edit Client ID"
                autofocus
              />
            </div>
            <div class="px-4 py-2 text-gray-900 dark:text-white">
              <span v-if="statuses[client]">{{ statuses[client] }}</span>
              <span v-else class="text-gray-400">Memuat...</span>
            </div>
            <div class="px-4 py-2 text-gray-900 dark:text-white">
              <span v-if="statuses[client] === 'ready' && waNumbers[client]">{{
                waNumbers[client]
              }}</span>
              <span v-else class="text-gray-400">-</span>
            </div>
            <div class="px-4 py-2 relative flex justify-end">
              <template v-if="editClientId === client">
                <button
                  @click="saveEdit(client)"
                  :disabled="
                    statuses[client] === 'ready' ||
                    statuses[client] === 'connected'
                  "
                  class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 transition text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:opacity-60 disabled:cursor-not-allowed mr-2"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Simpan
                </button>
                <button
                  @click="cancelEdit"
                  class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Batal
                </button>
              </template>
              <template v-else>
                <ClientActionMenu>
                  <template #trigger>
                    <button
                      @mousedown.stop
                      class="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      title="Aksi"
                      type="button"
                    >
                      <svg
                        class="w-5 h-5 text-gray-500 dark:text-gray-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <circle cx="4" cy="10" r="1.5" />
                        <circle cx="10" cy="10" r="1.5" />
                        <circle cx="16" cy="10" r="1.5" />
                      </svg>
                    </button>
                  </template>
                  <router-link
                    :to="{ name: 'ClientDetail', params: { clientId: client } }"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-gray-800 rounded transition"
                    >Detail</router-link
                  >
                  <button
                    v-if="editClientId !== client"
                    @click="startEdit(client)"
                    :disabled="
                      statuses[client] === 'ready' ||
                      statuses[client] === 'connected'
                    "
                    class="block w-full text-left px-4 py-2 text-sm text-yellow-700 dark:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-gray-800 rounded transition disabled:opacity-60 disabled:cursor-not-allowed font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    @click="confirmDelete(client)"
                    class="block w-full text-left px-4 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-800 rounded transition font-semibold"
                  >
                    Hapus
                  </button>
                  <button
                    v-if="
                      statuses[client] === 'ready' ||
                      statuses[client] === 'connected'
                    "
                    @click="confirmDisconnect(client, 'logout')"
                    class="block w-full text-left px-4 py-2 text-sm text-orange-700 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-gray-800 rounded transition"
                  >
                    Logout (QR Baru)
                  </button>
                  <button
                    v-if="
                      statuses[client] === 'ready' ||
                      statuses[client] === 'connected'
                    "
                    @click="confirmDisconnect(client, 'destroy')"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition"
                  >
                    Putus Koneksi (Session Tetap)
                  </button>
                  <button
                    v-if="
                      statuses[client] === 'disconnected' ||
                      statuses[client] === 'destroyed'
                    "
                    @click="reconnectClient(client)"
                    class="block w-full text-left px-4 py-2 text-sm text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-gray-800 rounded transition"
                  >
                    Reconnect
                  </button>
                  <button
                    v-if="statuses[client] === 'qr'"
                    @click="showQR(client)"
                    class="block w-full text-left px-4 py-2 text-sm text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-gray-800 rounded transition"
                  >
                    Scan QR
                  </button>
                </ClientActionMenu>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else-if="!loading && !error"
      class="text-gray-500 dark:text-gray-400 mt-8 text-center"
    >
      Belum ada client terdaftar.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { API_BASE_URL } from "../config";
import { notification } from "../composables/useNotification";
import { useDialog } from "../composables/useDialog";
import PrelineInput from "./_PrelineInput.vue";
import ClientActionMenu from "./ClientActionMenu.vue";

const { openDialog } = useDialog();

const clients = ref([]);
const loading = ref(false);
const error = ref("");
const statuses = ref({});
const showAddClient = ref(false);
const newClientId = ref("");
const addError = ref("");
const editClientId = ref("");
const editClientIdInput = ref("");
const clientToDelete = ref("");
const deleteWarning = ref("");
const clientToDisconnect = ref("");
const disconnectWarning = ref("");
const disconnectType = ref("logout");
const reconnectingClients = ref({}); // key: clientId, value: true/false
const showQRModal = ref("");
const qrImage = ref("");
const qrLoading = ref(false);
const pollingQR = ref(false);
const currentQRClient = ref("");
const waNumbers = ref({});

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
      if (data.status === "ready" && data.waNumber) {
        waNumbers.value[clientId] = data.waNumber;
      }
    } else {
      statuses.value[clientId] = data.status || "unknown";
      waNumbers.value[clientId] = undefined;
    }
  } catch (e) {
    statuses.value[clientId] = "unknown";
    waNumbers.value[clientId] = undefined;
  }
};

const addClient = async () => {
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
      notification("success", "Client berhasil ditambahkan.");
      showAddClient.value = false;
      newClientId.value = "";
      fetchClients();
    } else {
      notification("error", data.error || "Gagal menambah client.");
    }
  } catch (e) {
    notification("error", "Gagal menambah client.");
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
    notification("error", "Tidak bisa edit client yang sedang terhubung.");
    return;
  }
  try {
    await deleteClient(oldClientId, true);
    await addClientById(editClientIdInput.value);
    notification("success", "Client berhasil diedit.");
    editClientId.value = "";
    fetchClients();
  } catch (e) {
    notification("error", "Gagal mengedit client.");
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
    if (!silent) {
      if (response.ok) {
        notification("success", "Client berhasil dihapus.");
        fetchClients();
      } else {
        const data = await response.json();
        notification("error", data.error || "Gagal menghapus client.");
      }
    }
  } catch (e) {
    if (!silent) notification("error", "Gagal menghapus client.");
  }
};

const confirmDelete = (client) => {
  clientToDelete.value = client;
  const warning =
    statuses.value[client] === "ready" || statuses.value[client] === "connected"
      ? "Client sedang terhubung. Menghapus client akan mendisconnect WhatsApp. Lanjutkan?"
      : "Yakin ingin menghapus client ini?";
  openDialog({
    title: "Konfirmasi Hapus Client",
    description: warning,
    onYes: async () => {
      await deleteClient(client);
      clientToDelete.value = "";
    },
    onClose: () => {
      clientToDelete.value = "";
    },
    yes: "Ya, Hapus",
    no: "Batal",
  });
};

const confirmDisconnect = (client, type = "logout") => {
  clientToDisconnect.value = client;
  disconnectType.value = type;
  const warning =
    type === "logout"
      ? "Yakin ingin logout client ini? WhatsApp akan logout dan harus scan QR lagi."
      : "Yakin ingin memutus koneksi client ini? Session tetap ada, tidak perlu scan QR ulang.";
  openDialog({
    title: "Konfirmasi Disconnect Client",
    description: warning,
    onYes: async () => {
      await doDisconnectClient();
      clientToDisconnect.value = "";
    },
    onClose: () => {
      clientToDisconnect.value = "";
    },
    yes: "Ya, Disconnect",
    no: "Batal",
  });
};

const doDeleteClient = async () => {
  await deleteClient(clientToDelete.value);
  clientToDelete.value = "";
};

const doDisconnectClient = async () => {
  try {
    const endpoint =
      disconnectType.value === "destroy"
        ? `${API_BASE_URL}/clients/${clientToDisconnect.value}/destroy`
        : `${API_BASE_URL}/clients/${clientToDisconnect.value}/disconnect`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { ...getAuthHeaders() },
    });
    if (response.ok) {
      notification("success", "Client berhasil disconnect.");
      fetchClients();
    } else {
      const data = await response.json();
      notification("error", data.error || "Gagal disconnect client.");
    }
  } catch (e) {
    notification("error", "Gagal disconnect client.");
  }
};

const reconnectClient = async (clientId) => {
  reconnectingClients.value[clientId] = true;
  try {
    await fetch(`${API_BASE_URL}/sessions/${clientId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    });
    notification("success", "Client berhasil direconnect.");
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
    notification("error", "Gagal reconnect client.");
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
