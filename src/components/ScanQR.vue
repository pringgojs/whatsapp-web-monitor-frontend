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
      <span>Scan QR</span>
    </nav>
    <h1 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
      Scan QR Code WhatsApp
    </h1>
    <form
      @submit.prevent="fetchQrCode"
      class="flex flex-col gap-3 items-center mb-8"
    >
      <label class="sr-only">Client ID</label>
      <input
        v-model="clientId"
        type="text"
        placeholder="Masukkan Client ID"
        required
        class="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 w-full sm:w-64"
      />
      <div class="flex gap-2 w-full sm:w-auto">
        <button
          type="button"
          @click="createSession"
          :disabled="creatingSession"
          class="px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Buat Session
        </button>
        <button
          type="submit"
          :disabled="!sessionCreated"
          class="px-4 py-2 bg-emerald-600 text-white rounded font-semibold hover:bg-emerald-700 transition w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Tampilkan QR Code
        </button>
      </div>
    </form>
    <div v-if="loading" class="text-gray-500 dark:text-gray-300 mt-4">
      Memuat QR code...
    </div>
    <div v-if="error" class="text-red-500 mt-4">{{ error }}</div>
    <div v-if="success" class="text-emerald-600 mt-4">{{ success }}</div>
    <div v-if="qrImage" class="mt-8 flex flex-col items-center">
      <img
        :src="qrImage"
        alt="QR Code WhatsApp"
        class="w-56 h-56 rounded-xl border-2 border-gray-200 dark:border-gray-700"
      />
      <p class="mt-2 text-gray-600 dark:text-gray-300">
        Scan QR ini di WhatsApp Web
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { API_BASE_URL } from "../config";

const clientId = ref("");
const qrImage = ref("");
const error = ref("");
const success = ref("");
const loading = ref(false);
const sessionCreated = ref(false);
const creatingSession = ref(false);

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const createSession = async () => {
  error.value = "";
  sessionCreated.value = false;
  creatingSession.value = true;
  try {
    const response = await fetch(`${API_BASE_URL}/sessions/${clientId.value}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });
    const data = await response.json();
    if (response.ok) {
      sessionCreated.value = true;
      error.value = "Session berhasil dibuat. Silakan klik Tampilkan QR Code.";
    } else {
      error.value = data.error || "Gagal membuat session.";
    }
  } catch (e) {
    error.value = "Gagal membuat session.";
  } finally {
    creatingSession.value = false;
  }
};

const fetchQrCode = async () => {
  error.value = "";
  qrImage.value = "";
  loading.value = true;
  let polling;
  const poll = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/sessions/${clientId.value}/qr`,
        { headers: { ...getAuthHeaders() } }
      );
      const data = await response.json();
      if (response.ok && data.qrImage) {
        if (qrImage.value !== data.qrImage) {
          qrImage.value = data.qrImage;
        }
        // polling QR setiap 3 detik selama status masih QR
        polling = setTimeout(poll, 3000);
      } else {
        // Cek status client jika QR tidak ditemukan
        const statusRes = await fetch(
          `${API_BASE_URL}/sessions/${clientId.value}/status`,
          { headers: { ...getAuthHeaders() } }
        );
        const statusData = await statusRes.json();
        if (statusRes.ok && statusData.status === "ready") {
          qrImage.value = "";
          error.value = "";
          success.value = "Client berhasil connect!";
        } else {
          error.value = data.error || "QR code tidak ditemukan.";
        }
        clearTimeout(polling);
      }
    } catch (e) {
      error.value = "Gagal mengambil QR code.";
      clearTimeout(polling);
    } finally {
      loading.value = false;
    }
  };
  poll();
};
</script>
