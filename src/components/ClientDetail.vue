<template>
  <div
    class="flex flex-col md:flex-row min-h-[400px] bg-white dark:bg-gray-900 rounded-xl shadow-lg mx-auto mt-10 max-w-4xl"
  >
    <aside
      class="w-full md:w-56 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-t-xl md:rounded-l-xl md:rounded-tr-none p-6 flex-shrink-0"
    >
      <div class="mb-6 border-b border-gray-700 pb-4">
        <div class="text-xs text-gray-400">Client ID:</div>
        <div class="relative">
          <button
            @click="showClientDropdown = !showClientDropdown"
            class="font-bold text-lg break-all w-full text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
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
            class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg"
          >
            <ul>
              <li v-for="c in clients" :key="c">
                <button
                  @click="selectClient(c)"
                  class="w-full text-left px-3 py-2 hover:bg-emerald-100 dark:hover:bg-emerald-700 rounded text-gray-900 dark:text-white"
                  :class="{ 'bg-emerald-600 text-white': c === clientId }"
                >
                  {{ c }}
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div v-if="waNumber" class="text-xs text-gray-400 mt-2">Nomor WA:</div>
        <div v-if="waNumber" class="font-semibold text-emerald-300 break-all">
          {{ waNumber }}
        </div>
      </div>
      <ul class="space-y-2">
        <li
          :class="[
            'cursor-pointer rounded px-4 py-2 font-semibold transition text-gray-800 dark:text-white',
            activeMenu === 'send-message'
              ? 'bg-emerald-600 text-white'
              : 'hover:bg-gray-700 hover:text-emerald-300',
          ]"
          @click="activeMenu = 'send-message'"
        >
          Kirim Pesan
        </li>
        <li
          :class="[
            'cursor-pointer rounded px-4 py-2 font-semibold transition text-gray-800 dark:text-white',
            activeMenu === 'webhook'
              ? 'bg-emerald-600 text-white'
              : 'hover:bg-gray-700 hover:text-emerald-300',
          ]"
          @click="activeMenu = 'webhook'"
        >
          Konfigurasi Webhook
        </li>
        <li
          :class="[
            'cursor-pointer rounded px-4 py-2 font-semibold transition text-gray-800 dark:text-white',
            activeMenu === 'group'
              ? 'bg-emerald-600 text-white'
              : 'hover:bg-gray-700 hover:text-emerald-300',
          ]"
          @click="activeMenu = 'group'"
        >
          Manajemen Group
        </li>
      </ul>
    </aside>
    <main
      class="flex-1 p-6 bg-white dark:bg-gray-900 rounded-b-xl md:rounded-r-xl md:rounded-bl-none"
    >
      <h2 class="text-xl font-bold mb-4 text-gray-800 dark:text-white">
        Detail Client: {{ clientId }}
      </h2>
      <div v-if="activeMenu === 'send-message'">
        <h3 class="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">
          Kirim Pesan
        </h3>
        <form
          @submit.prevent="sendMessage"
          class="flex flex-col gap-3 max-w-md mt-4"
        >
          <input
            v-model="to"
            placeholder="Nomor Tujuan (62...)"
            required
            class="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <textarea
            v-model="message"
            placeholder="Isi Pesan"
            required
            class="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 min-h-[90px]"
          />
          <button
            type="submit"
            class="py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors mt-2"
          >
            Kirim
          </button>
        </form>
        <div
          v-if="msgResult"
          class="mt-3 text-emerald-600 dark:text-emerald-400"
        >
          {{ msgResult }}
        </div>
      </div>
      <div v-else-if="activeMenu === 'webhook'">
        <h3 class="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">
          Konfigurasi Webhook
        </h3>
        <form
          @submit.prevent="saveWebhook"
          class="flex flex-col gap-3 max-w-md mt-4"
        >
          <input
            v-model="webhookUrl"
            placeholder="Webhook URL"
            required
            class="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <button
            type="submit"
            class="py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors mt-2"
          >
            Simpan
          </button>
        </form>
        <div
          v-if="webhookResult"
          class="mt-3 text-emerald-600 dark:text-emerald-400"
        >
          {{ webhookResult }}
        </div>
      </div>
      <div v-else-if="activeMenu === 'group'">
        <h3 class="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">
          Manajemen Group
        </h3>
        <button
          @click="fetchGroups"
          class="px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition mb-4"
        >
          Refresh Group
        </button>
        <ul class="space-y-2">
          <li
            v-for="g in groups"
            :key="g.id"
            class="bg-gray-100 dark:bg-gray-800 rounded px-4 py-2 text-gray-800 dark:text-gray-100"
          >
            {{ g.name }} <span class="text-xs text-gray-400">({{ g.id }})</span>
          </li>
        </ul>
        <div v-if="groupError" class="text-red-500 mt-3">{{ groupError }}</div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { API_BASE_URL } from "../config";
import { notification } from "../composables/useNotification";

const route = useRoute();
const router = useRouter();
const clientId = ref(route.params.clientId);
const clients = ref([]);
const activeMenu = ref("send-message");
const waNumber = ref("");
const showClientDropdown = ref(false);

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
    msgResult.value = "";
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
  }
);

// Kirim Pesan
const to = ref("");
const message = ref("");
const msgResult = ref("");
const sendMessage = async () => {
  msgResult.value = "";
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
      msgResult.value = "Pesan berhasil dikirim!";
      notification("success", "Pesan berhasil dikirim!");
      to.value = "";
      message.value = "";
    } else {
      msgResult.value = data.error || "Gagal mengirim pesan.";
      notification("error", msgResult.value);
    }
  } catch (e) {
    msgResult.value = "Gagal mengirim pesan.";
    notification("error", "Gagal mengirim pesan.");
  }
};

// Webhook
const webhookUrl = ref("");
const webhookResult = ref("");
const saveWebhook = async () => {
  webhookResult.value = "";
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${API_BASE_URL}/sessions/${clientId.value}/webhook`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ webhookUrl: webhookUrl.value }),
      }
    );
    const data = await res.json();
    if (res.ok) {
      webhookResult.value = "Webhook berhasil disimpan.";
      notification("success", "Webhook berhasil disimpan.");
    } else {
      webhookResult.value = data.error || "Gagal menyimpan webhook.";
      notification("error", webhookResult.value);
    }
  } catch (e) {
    webhookResult.value = "Gagal menyimpan webhook.";
    notification("error", "Gagal menyimpan webhook.");
  }
};
onMounted(async () => {
  // Fetch webhook URL dari backend
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${API_BASE_URL}/sessions/${clientId.value}/webhook`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    if (res.ok && data.webhookUrl) {
      webhookUrl.value = data.webhookUrl;
    } else {
      webhookUrl.value = "";
    }
  } catch {
    webhookUrl.value = "";
  }
});

// Group
const groups = ref([]);
const groupError = ref("");
const fetchGroups = async () => {
  groupError.value = "";
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
      groupError.value = data.error || "Gagal memuat group.";
      notification("error", groupError.value);
    }
  } catch (e) {
    groupError.value = "Gagal memuat group.";
    notification("error", "Gagal memuat group.");
  }
};

function selectClient(c) {
  showClientDropdown.value = false;
  if (c !== clientId.value) {
    router.push({ name: "ClientDetail", params: { clientId: c } });
  }
}
</script>

<!-- Tailwind migration: form section only. -->
