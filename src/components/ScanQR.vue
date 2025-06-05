<template>
  <div class="scanqr-container">
    <h1>Scan QR Code WhatsApp</h1>
    <p>
      Fitur ini akan menampilkan QR code dari backend untuk login WhatsApp Web.
    </p>
    <!-- Nanti di sini akan ada tampilan QR code dari backend -->
    <div class="qr-placeholder">QR Code akan muncul di sini</div>
  </div>
</template>

<script setup>
// Integrasi API QR code akan ditambahkan di sini
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
.qr-placeholder {
  margin: 2rem auto;
  width: 220px;
  height: 220px;
  background: #f3f3f3;
  border: 2px dashed #bbb;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 1.1rem;
}
@media (prefers-color-scheme: dark) {
  .scanqr-container {
    background: var(--dashboard-bg-dark, #23272f);
    color: #fff;
  }
  .qr-placeholder {
    background: #23272f;
    border-color: #444;
    color: #666;
  }
}
</style>
