# WhatsApp Web Monitoring Frontend

Frontend aplikasi monitoring WhatsApp Web berbasis Vue 3 (Vite) dan Tailwind CSS.

## Fitur Utama

- **Login & Register** (autentikasi JWT)
- **Dashboard**: Ringkasan dan navigasi utama
- **Daftar Client**: Tabel client WhatsApp, status real-time, refresh, hapus, edit, reconnect, scan QR
- **Sidebar Client Detail**:
  - Dropdown untuk memilih client aktif
  - Tampilkan Client ID & Nomor WA
  - Navigasi sidebar: Kirim Pesan, Konfigurasi Webhook, Manajemen Group
- **Kirim Pesan**: Form kirim pesan WhatsApp ke nomor tujuan
- **Konfigurasi Webhook**: Form simpan URL webhook per client (terhubung backend)
- **Manajemen Group**: Lihat dan refresh daftar group WhatsApp client
- **Scan QR**: Modal scan QR code untuk login WhatsApp
- **Status Client**: Cek status koneksi client
- **Dark Mode & Light Mode**: Otomatis mengikuti preferensi OS
- **UI Modern & Responsif**: Seluruh tampilan menggunakan Tailwind CSS
- **Error Handling**: Notifikasi error & feedback pada semua form

## Instalasi & Menjalankan

1. `npm install`
2. Salin/atur file `.env` jika perlu (`VITE_API_BASE_URL`)
3. `npm run dev`

## Struktur Utama

- `src/components/` - Semua komponen utama (Login, Register, Dashboard, ClientsList, ClientDetail, dsb)
- `src/config.js` - Konfigurasi API
- `src/router.js` - Routing aplikasi

## Catatan

- Pastikan backend sudah berjalan dan API URL sudah benar.
- Token JWT disimpan di localStorage.
- Semua fitur sudah terintegrasi penuh dengan backend.
