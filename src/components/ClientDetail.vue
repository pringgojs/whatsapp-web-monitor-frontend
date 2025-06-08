<template>
  <div class="client-detail-container">
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="client-label">Client ID:</div>
        <div class="client-id">{{ clientId }}</div>
        <div v-if="waNumber" class="wa-label">Nomor WA:</div>
        <div v-if="waNumber" class="wa-number">{{ waNumber }}</div>
      </div>
      <ul>
        <li
          :class="{ active: activeMenu === 'send-message' }"
          @click="activeMenu = 'send-message'"
        >
          Kirim Pesan
        </li>
        <li
          :class="{ active: activeMenu === 'webhook' }"
          @click="activeMenu = 'webhook'"
        >
          Konfigurasi Webhook
        </li>
        <li
          :class="{ active: activeMenu === 'group' }"
          @click="activeMenu = 'group'"
        >
          Manajemen Group
        </li>
      </ul>
    </aside>
    <main class="content">
      <h2>Detail Client: {{ clientId }}</h2>
      <div v-if="activeMenu === 'send-message'">
        <h3>Kirim Pesan</h3>
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
        <h3>Konfigurasi Webhook</h3>
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
        <h3>Manajemen Group</h3>
        <button @click="fetchGroups">Refresh Group</button>
        <ul>
          <li v-for="g in groups" :key="g.id">{{ g.name }} ({{ g.id }})</li>
        </ul>
        <div v-if="groupError" class="error">{{ groupError }}</div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { API_BASE_URL } from "../config";

const route = useRoute();
const clientId = route.params.clientId;
const activeMenu = ref("send-message");
const waNumber = ref("");

onMounted(async () => {
  // Fetch info client dari backend
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/sessions/${clientId}/info`, {
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
      body: JSON.stringify({ clientId, to: to.value, message: message.value }),
    });
    const data = await res.json();
    if (res.ok) {
      msgResult.value = "Pesan berhasil dikirim!";
      to.value = "";
      message.value = "";
    } else {
      msgResult.value = data.error || "Gagal mengirim pesan.";
    }
  } catch (e) {
    msgResult.value = "Gagal mengirim pesan.";
  }
};

// Webhook
const webhookUrl = ref("");
const webhookResult = ref("");
const saveWebhook = async () => {
  webhookResult.value = "";
  // Simulasi: simpan ke localStorage (implementasi backend bisa ditambah nanti)
  localStorage.setItem(`webhook_${clientId}`, webhookUrl.value);
  webhookResult.value = "Webhook disimpan (simulasi).";
};
onMounted(() => {
  webhookUrl.value = localStorage.getItem(`webhook_${clientId}`) || "";
});

// Group
const groups = ref([]);
const groupError = ref("");
const fetchGroups = async () => {
  groupError.value = "";
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/sessions/${clientId}/groups`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok && Array.isArray(data.groups)) {
      groups.value = data.groups;
    } else {
      groupError.value = data.error || "Gagal memuat group.";
    }
  } catch (e) {
    groupError.value = "Gagal memuat group.";
  }
};
</script>

<!-- Tailwind migration: form section only. -->
