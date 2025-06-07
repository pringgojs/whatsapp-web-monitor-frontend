<template>
  <div class="client-detail-container">
    <aside class="sidebar">
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
        <form @submit.prevent="sendMessage">
          <input v-model="to" placeholder="Nomor Tujuan (62...)" required />
          <textarea
            v-model="message"
            placeholder="Isi Pesan"
            required
          ></textarea>
          <button type="submit">Kirim</button>
        </form>
        <div v-if="msgResult" class="result">{{ msgResult }}</div>
      </div>
      <div v-else-if="activeMenu === 'webhook'">
        <h3>Konfigurasi Webhook</h3>
        <form @submit.prevent="saveWebhook">
          <input v-model="webhookUrl" placeholder="Webhook URL" required />
          <button type="submit">Simpan</button>
        </form>
        <div v-if="webhookResult" class="result">{{ webhookResult }}</div>
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

<style scoped>
.client-detail-container {
  display: flex;
  min-height: 400px;
  background: var(--dashboard-bg, #fff);
  border-radius: 10px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
  margin: 40px auto;
  max-width: 900px;
}
.sidebar {
  width: 200px;
  background: #23272f;
  color: #fff;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  padding: 2rem 0.5rem;
}
.sidebar ul {
  list-style: none;
  padding: 0;
}
.sidebar li {
  padding: 1rem 1.2rem;
  cursor: pointer;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  transition: background 0.2s;
}
.sidebar li.active,
.sidebar li:hover {
  background: #42b983;
  color: #fff;
}
.content {
  flex: 1;
  padding: 2rem;
}
.result {
  margin-top: 1rem;
  color: #27ae60;
}
.error {
  color: #e74c3c;
  margin-top: 1rem;
}
@media (max-width: 700px) {
  .client-detail-container {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    border-radius: 10px 10px 0 0;
    padding: 1rem;
  }
  .content {
    padding: 1rem;
  }
}
@media (prefers-color-scheme: dark) {
  .client-detail-container {
    background: var(--dashboard-bg-dark, #23272f);
    color: #fff;
  }
  .sidebar {
    background: #181b20;
    color: #fff;
  }
  .sidebar li.active,
  .sidebar li:hover {
    background: #42b983;
    color: #fff;
  }
  .content {
    background: #23272f;
    color: #fff;
  }
  input,
  textarea {
    background: #23272f;
    color: #fff;
    border: 1px solid #444;
  }
  input::placeholder,
  textarea::placeholder {
    color: #aaa;
  }
  button {
    background: #42b983;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 0.5rem 1.2rem;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s;
  }
  button:hover {
    background: #369870;
  }
  .result {
    color: #7fffaf;
  }
  .error {
    color: #ff7b7b;
  }
}
</style>
