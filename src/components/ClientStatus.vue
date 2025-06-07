<template>
  <div class="clientstatus-container">
    <nav class="breadcrumb">
      <router-link to="/">Home</router-link> / Status
    </nav>
    <h1>Cek Status Client WhatsApp</h1>
    <form @submit.prevent="checkStatus">
      <label>Client ID</label>
      <input
        v-model="clientId"
        type="text"
        placeholder="Masukkan Client ID"
        required
      />
      <button type="submit">Cek Status</button>
    </form>
    <div v-if="loading" class="loading">Memuat status...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="status" class="status-info">
      <strong>Status:</strong> {{ status }}
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const clientId = ref("");
const status = ref("");
const error = ref("");
const loading = ref(false);

const checkStatus = async () => {
  error.value = "";
  status.value = "";
  loading.value = true;
  try {
    const response = await fetch(
      `http://localhost:3000/sessions/${clientId.value}/status`
    );
    const data = await response.json();
    if (response.ok && data.status) {
      status.value = data.status;
    } else {
      error.value = data.error || "Status tidak ditemukan.";
    }
  } catch (e) {
    error.value = "Gagal mengambil status.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.clientstatus-container {
  max-width: 500px;
  margin: 40px auto;
  padding: 2rem;
  background: var(--dashboard-bg, #fff);
  border-radius: 10px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
  text-align: center;
}
.clientstatus-container form {
  margin-bottom: 2rem;
}
.clientstatus-container input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 1rem;
  width: 200px;
}
.clientstatus-container button {
  padding: 0.5rem 1.2rem;
  background: #42b983;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.clientstatus-container button:hover {
  background: #369870;
}
.status-info {
  margin-top: 1.5rem;
  font-size: 1.2rem;
  color: #2ecc71;
}
.loading {
  color: #888;
  margin-top: 1rem;
}
.error {
  color: #e74c3c;
  margin-top: 1rem;
}
.breadcrumb {
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}
.breadcrumb a {
  color: #42b983;
  text-decoration: none;
}
.breadcrumb a:hover {
  text-decoration: underline;
}
@media (prefers-color-scheme: dark) {
  .clientstatus-container {
    background: var(--dashboard-bg-dark, #23272f);
    color: #fff;
  }
  .clientstatus-container input {
    background: #181a20;
    color: #fff;
    border-color: #444;
  }
  .breadcrumb a {
    color: #7fffd4;
  }
}
</style>
