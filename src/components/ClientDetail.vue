<template>
  <div
    class="flex flex-col md:flex-row min-h-[400px] bg-white dark:bg-gray-900 rounded-2xl shadow-xl mx-auto mt-10 max-w-4xl border border-gray-200 dark:border-gray-800"
  >
    <aside
      class="w-full md:w-56 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none p-6 flex-shrink-0 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-800"
    >
      <div class="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <div class="text-xs text-gray-400">Client ID:</div>
        <div class="relative">
          <button
            @click="showClientDropdown = !showClientDropdown"
            class="font-bold text-lg break-all w-full text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded-lg px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {{ clientId }}
            <svg
              class="w-4 h-4 ml-2 inline-block"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <div
            v-if="showClientDropdown"
            class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg"
          >
            <ul>
              <li v-for="c in clients" :key="c">
                <button
                  @click="selectClient(c)"
                  class="w-full text-left px-3 py-2 hover:bg-emerald-100 dark:hover:bg-emerald-700 rounded-lg text-gray-900 dark:text-white transition"
                  :class="{ 'bg-emerald-600 text-white': c === clientId }"
                >
                  {{ c }}
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div v-if="waNumber" class="text-xs text-gray-400 mt-2">Nomor WA:</div>
        <div v-if="waNumber" class="font-semibold text-emerald-400 break-all">
          {{ waNumber }}
        </div>
        <div v-if="apiKey" class="mt-4">
          <div class="text-xs text-gray-400 mb-1">API Key:</div>
          <div class="flex items-center gap-2">
            <PrelineInput
              v-model="apiKey"
              type="text"
              placeholder="API Key"
              readonly
              :error="''"
              class="flex-1"
            />
            <button
              type="button"
              @click="apiKeyVisible = !apiKeyVisible"
              class="p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
              :title="apiKeyVisible ? 'Sembunyikan' : 'Tampilkan'"
            >
              <svg
                v-if="!apiKeyVisible"
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <svg
                v-else
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.223-3.592m3.1-2.727A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.965 9.965 0 01-4.293 5.411M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 6L6 6"
                />
              </svg>
            </button>
            <button
              type="button"
              @click="copyApiKey"
              class="p-2 rounded bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-200 hover:bg-emerald-200 dark:hover:bg-emerald-700 border border-emerald-200 dark:border-emerald-700"
              title="Salin API Key"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
            </button>
            <button
              type="button"
              @click="generateApiKey"
              class="p-2 rounded bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-700 border border-blue-200 dark:border-blue-700"
              title="Generate API Key Baru"
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
            </button>
          </div>
        </div>
      </div>
      <ul class="space-y-2">
        <li
          :class="[
            'cursor-pointer rounded-lg px-4 py-2 font-semibold transition text-gray-800 dark:text-white',
            activeMenu === 'send-message'
              ? 'bg-emerald-600 text-white'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700',
          ]"
          @click="activeMenu = 'send-message'"
        >
          Kirim Pesan
        </li>
        <li
          :class="[
            'cursor-pointer rounded-lg px-4 py-2 font-semibold transition text-gray-800 dark:text-white',
            activeMenu === 'webhook'
              ? 'bg-emerald-600 text-white'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700',
          ]"
          @click="activeMenu = 'webhook'"
        >
          Konfigurasi Webhook
        </li>
        <li
          :class="[
            'cursor-pointer rounded-lg px-4 py-2 font-semibold transition text-gray-800 dark:text-white',
            activeMenu === 'group'
              ? 'bg-emerald-600 text-white'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700',
          ]"
          @click="activeMenu = 'group'"
        >
          Manajemen Group
        </li>
        <li
          :class="[
            'cursor-pointer rounded-lg px-4 py-2 font-semibold transition text-gray-800 dark:text-white',
            activeMenu === 'api-key'
              ? 'bg-emerald-600 text-white'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700',
          ]"
          @click="activeMenu = 'api-key'"
        >
          API Key
        </li>
      </ul>
    </aside>
    <main
      class="flex-1 p-8 bg-white dark:bg-gray-900 rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none"
    >
      <div v-if="activeMenu === 'send-message'">
        <h3 class="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">
          Kirim Pesan
        </h3>
        <form
          @submit.prevent="sendMessage"
          class="flex flex-col gap-4 max-w-md mt-4"
        >
          <div>
            <label
              class="block mb-1 font-semibold text-gray-700 dark:text-gray-200"
              >Nomor Tujuan</label
            >
            <PrelineInput
              v-model="to"
              type="text"
              placeholder="Nomor Tujuan (62...)"
              required
              :error="''"
            />
          </div>
          <div>
            <label
              class="block mb-1 font-semibold text-gray-700 dark:text-gray-200"
              >Isi Pesan</label
            >
            <textarea
              v-model="message"
              placeholder="Isi Pesan"
              required
              rows="4"
              class="w-full min-h-[90px] px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
            ></textarea>
          </div>
          <button
            type="submit"
            class="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-400 text-white font-semibold transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            Kirim
          </button>
        </form>
      </div>
      <div v-else-if="activeMenu === 'webhook'">
        <h3 class="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">
          Konfigurasi Webhook
        </h3>
        <form
          @submit.prevent="saveWebhookConfig"
          class="flex flex-col gap-4 max-w-md mt-4"
        >
          <label class="text-sm font-medium text-gray-600 dark:text-gray-300"
            >Webhook URL</label
          >
          <PrelineInput
            v-model="webhookUrl"
            type="text"
            placeholder="https://your-webhook-url.com/endpoint"
            required
            :error="''"
          />
          <label
            class="text-sm font-medium text-gray-600 dark:text-gray-300 mt-2"
            >Custom Headers (JSON)</label
          >
          <textarea
            v-model="webhookHeaders"
            rows="4"
            class="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-400"
            placeholder='{"Authorization": "Bearer ..."}'
          ></textarea>
          <div v-if="webhookHeadersError" class="text-red-500 text-xs">
            {{ webhookHeadersError }}
          </div>
          <div class="flex gap-2 justify-end mt-2">
            <button
              type="submit"
              class="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 transition text-sm font-semibold shadow-sm"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
      <div v-else-if="activeMenu === 'group'">
        <h3 class="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">
          Manajemen Group
        </h3>
        <button
          @click="fetchGroups"
          class="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition mb-4 shadow"
        >
          Refresh Group
        </button>
        <ul class="space-y-2">
          <li
            v-for="g in groups"
            :key="g.id"
            class="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 text-gray-800 dark:text-gray-100 shadow-sm"
          >
            {{ g.name }} <span class="text-xs text-gray-400">({{ g.id }})</span>
          </li>
        </ul>
      </div>
      <div
        v-else-if="activeMenu === 'api-key'"
        class="mt-8 p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
      >
        <h3 class="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">
          API Key
        </h3>
        <div class="flex items-center gap-2">
          <PrelineInput
            v-model="apiKey"
            type="text"
            placeholder="API Key"
            readonly
            :error="''"
            class="flex-1"
          />
          <button
            type="button"
            @click="apiKeyVisible = !apiKeyVisible"
            class="p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
            :title="apiKeyVisible ? 'Sembunyikan' : 'Tampilkan'"
          >
            <svg
              v-if="!apiKeyVisible"
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <svg
              v-else
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.223-3.592m3.1-2.727A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.965 9.965 0 01-4.293 5.411M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 6L6 6"
              />
            </svg>
          </button>
          <button
            type="button"
            @click="copyApiKey"
            class="p-2 rounded bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-200 hover:bg-emerald-200 dark:hover:bg-emerald-700 border border-emerald-200 dark:border-emerald-700"
            title="Salin API Key"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
          </button>
          <button
            type="button"
            @click="generateApiKey"
            class="p-2 rounded bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-700 border border-blue-200 dark:border-blue-700"
            title="Generate API Key Baru"
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
          </button>
        </div>
        <div class="text-xs text-gray-400 mt-2">
          API Key ini digunakan untuk mengakses API secara langsung. Jaga
          kerahasiaan API Key ini seperti Anda menjaga password.
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { API_BASE_URL } from "../config";
import { notification } from "../composables/useNotification";
import PrelineInput from "./_PrelineInput.vue";

const route = useRoute();
const router = useRouter();
const clientId = ref(route.params.clientId);
const clients = ref([]);
const activeMenu = ref("send-message");
const waNumber = ref("");
const showClientDropdown = ref(false);
const apiKey = ref("");
const apiKeyVisible = ref(false);

// Fetch all clients for dropdown
const fetchClients = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/sessions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.sessions) {
      clients.value = data.sessions.map((s) => s.clientId || s.id || s);
    }
  } catch {}
};

onMounted(async () => {
  fetchClients();
  // Fetch info client dari backend
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/sessions/${clientId.value}/info`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok && data.waNumber) {
      waNumber.value = data.waNumber;
    } else {
      waNumber.value = "";
    }
  } catch {
    waNumber.value = "";
  }
});

// Watch for route changes to update clientId dan data terkait
watch(
  () => route.params.clientId,
  async (newId) => {
    clientId.value = newId;
    // Reset form kirim pesan
    to.value = "";
    message.value = "";
    // Fetch info client baru
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/sessions/${newId}/info`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.waNumber) {
        waNumber.value = data.waNumber;
      } else {
        waNumber.value = "";
      }
    } catch {
      waNumber.value = "";
    }
    // Fetch webhook client baru
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/sessions/${newId}/webhook`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.webhookUrl) {
        webhookUrl.value = data.webhookUrl;
      } else {
        webhookUrl.value = "";
      }
    } catch {
      webhookUrl.value = "";
    }
    // Fetch API key
    fetchApiKey();
  }
);

// Kirim Pesan
const to = ref("");
const message = ref("");
const sendMessage = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        clientId: clientId.value,
        to: to.value,
        message: message.value,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      notification("success", "Pesan berhasil dikirim!");
      to.value = "";
      message.value = "";
    } else {
      notification("error", data.error || "Gagal mengirim pesan.");
    }
  } catch (e) {
    notification("error", "Gagal mengirim pesan.");
  }
};

// Webhook
const webhookUrl = ref("");
const webhookHeaders = ref("");
const webhookHeadersError = ref("");
const fetchWebhookConfig = async () => {
  try {
    const token = localStorage.getItem("token");
    // Fetch URL
    const res = await fetch(
      `${API_BASE_URL}/sessions/${clientId.value}/webhook`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    webhookUrl.value = data.webhookUrl || "";
    // Fetch headers
    const res2 = await fetch(
      `${API_BASE_URL}/sessions/${clientId.value}/webhook-headers`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data2 = await res2.json();
    webhookHeaders.value = data2.headers
      ? JSON.stringify(data2.headers, null, 2)
      : "";
  } catch (e) {
    webhookUrl.value = "";
    webhookHeaders.value = "";
  }
};

const saveWebhookConfig = async () => {
  try {
    // Save URL
    const token = localStorage.getItem("token");
    await fetch(`${API_BASE_URL}/sessions/${clientId.value}/webhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ webhookUrl: webhookUrl.value }),
    });
    // Save headers
    let headersObj = {};
    webhookHeadersError.value = "";
    if (webhookHeaders.value) {
      try {
        headersObj = JSON.parse(webhookHeaders.value);
      } catch (e) {
        webhookHeadersError.value = "Format JSON header tidak valid";
        return;
      }
    }
    await fetch(`${API_BASE_URL}/sessions/${clientId.value}/webhook-headers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ headers: headersObj }),
    });
    notification("success", "Webhook config berhasil disimpan");
  } catch (e) {
    notification("error", "Gagal menyimpan webhook config");
  }
};

// Fetch config when menu is opened or client changes
watch(
  [activeMenu, clientId],
  ([menu, id], [oldMenu, oldId]) => {
    if (menu === "webhook") fetchWebhookConfig();
  },
  { immediate: true }
);

// Group
const groups = ref([]);
const fetchGroups = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${API_BASE_URL}/sessions/${clientId.value}/groups`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    if (res.ok && Array.isArray(data.groups)) {
      groups.value = data.groups;
    } else {
      notification("error", data.error || "Gagal memuat group.");
    }
  } catch (e) {
    notification("error", "Gagal memuat group.");
  }
};

const fetchApiKey = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/clients/${clientId.value}/token`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok && data.token) {
      apiKey.value = data.token;
    } else {
      apiKey.value = "";
    }
  } catch {
    apiKey.value = "";
  }
};

watch(
  () => clientId.value,
  () => {
    fetchApiKey();
  },
  { immediate: true }
);

function copyApiKey() {
  if (apiKey.value) {
    navigator.clipboard.writeText(apiKey.value);
    notification("success", "API Key disalin ke clipboard");
  }
}

function selectClient(c) {
  showClientDropdown.value = false;
  if (c !== clientId.value) {
    router.push({ name: "ClientDetail", params: { clientId: c } });
  }
}

const generateApiKey = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/clients/${clientId.value}/token`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok && data.token) {
      apiKey.value = data.token;
      notification("success", "API Key baru berhasil dibuat!");
    } else {
      notification("error", data.error || "Gagal generate API Key");
    }
  } catch {
    notification("error", "Gagal generate API Key");
  }
};
</script>

<!-- Tailwind migration: form section only. -->
