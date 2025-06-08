<template>
  <div
    class="max-w-md mx-auto mt-12 p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg text-center"
  >
    <nav
      class="mb-6 text-sm text-gray-500 dark:text-gray-300 flex items-center gap-1 justify-center"
    >
      <router-link to="/" class="text-emerald-600 hover:underline"
        >Home</router-link
      >
      <span>/</span>
      <span>Status</span>
    </nav>
    <h1 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
      Cek Status Client WhatsApp
    </h1>
    <form
      @submit.prevent="checkStatus"
      class="flex flex-col sm:flex-row gap-2 justify-center items-center mb-8"
    >
      <label class="sr-only">Client ID</label>
      <input
        v-model="clientId"
        type="text"
        placeholder="Masukkan Client ID"
        required
        class="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 w-full sm:w-64"
      />
      <button
        type="submit"
        class="px-4 py-2 bg-emerald-600 text-white rounded font-semibold hover:bg-emerald-700 transition w-full sm:w-auto"
      >
        Cek Status
      </button>
    </form>
    <div v-if="loading" class="text-gray-500 dark:text-gray-300 mt-4">
      Memuat status...
    </div>
    <div v-if="error" class="text-red-500 mt-4">{{ error }}</div>
    <div
      v-if="status"
      class="mt-6 text-lg text-emerald-600 dark:text-emerald-400 font-semibold"
    >
      <strong>Status:</strong> {{ status }}
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { API_BASE_URL } from "../config";

const clientId = ref("");
const status = ref("");
const error = ref("");
const loading = ref(false);

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const checkStatus = async () => {
  error.value = "";
  status.value = "";
  loading.value = true;
  try {
    const response = await fetch(
      `${API_BASE_URL}/sessions/${clientId.value}/status`,
      {
        headers: { ...getAuthHeaders() },
      }
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
