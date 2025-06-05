<template>
  <div class="scanqr-container">
    <h1>Scan QR Code WhatsApp</h1>
    <form @submit.prevent="fetchQrCode">
      <label>Client ID</label>
      <input
        v-model="clientId"
        type="text"
        placeholder="Masukkan Client ID"
        required
      />
      <button
        type="button"
        @click="createSession"
        :disabled="creatingSession"
        class="session-button"
      >
        Buat Session
      </button>
      <button type="submit" :disabled="!sessionCreated" class="qr-button">
        Tampilkan QR Code
      </button>
    </form>
    <div v-if="loading" class="loading">Memuat QR code...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="success" class="success">{{ success }}</div>
    <div v-if="qrImage" class="qr-image">
      <img :src="qrImage" alt="QR Code WhatsApp" />
      <p>Scan QR ini di WhatsApp Web</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const clientId = ref("");
const qrImage = ref("");
const error = ref("");
const success = ref("");
const loading = ref(false);
const sessionCreated = ref(false);
const creatingSession = ref(false);

const createSession = async () => {
  error.value = "";
  sessionCreated.value = false;
  creatingSession.value = true;
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:3000/sessions/${clientId.value}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );
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
        `http://localhost:3000/sessions/${clientId.value}/qr`
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
          `http://localhost:3000/sessions/${clientId.value}/status`
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

<style scoped>
.scanqr-container {
  max-width: 500px;
  margin: 40px auto;
  padding: 2rem;
  background: var(--dashboard-bg, #fff);
  border-radius: 10px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
  text-align: center;
}
.scanqr-container form {
  margin-bottom: 2rem;
}
.scanqr-container input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 1rem;
  width: 200px;
}
.session-button {
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
.session-button:hover {
  background: #0056b3;
}
.qr-button {
  padding: 0.5rem 1.2rem;
  background: #42b983;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.qr-button:hover {
  background: #369870;
}
.qr-image {
  margin-top: 2rem;
}
.qr-image img {
  width: 220px;
  height: 220px;
  border-radius: 12px;
  border: 2px solid #eee;
}
.loading {
  color: #888;
  margin-top: 1rem;
}
.error {
  color: #e74c3c;
  margin-top: 1rem;
}
.success {
  color: #2ecc71;
  margin-top: 1rem;
}
@media (prefers-color-scheme: dark) {
  .scanqr-container {
    background: var(--dashboard-bg-dark, #23272f);
    color: #fff;
  }
  .scanqr-container input {
    background: #181a20;
    color: #fff;
    border-color: #444;
  }
  .qr-image img {
    border-color: #444;
  }
}
</style>
