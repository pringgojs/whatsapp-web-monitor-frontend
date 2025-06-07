# WhatsApp Web Monitor - Frontend

This is the frontend for WhatsApp Web Monitor, built with Vue.js 3 and Vite. It provides a responsive dashboard for managing and monitoring multiple WhatsApp Web clients, including login, QR scan, client status, and user management.

## Features

- Login & registration (JWT authentication)
- Dashboard for all WhatsApp clients
- Scan QR code for WhatsApp Web
- Real-time client status (ready, qr, disconnected, destroyed, etc.)
- Add, edit, delete, disconnect, destroy, and reconnect clients
- Role-based access (admin/user)
- Responsive UI with dark mode support
- User-friendly modals and notifications

## Requirements

- Node.js v16 or later
- npm

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Configure API URL:**

   - By default, the frontend expects the backend at `http://localhost:3000`.
   - To change, edit API URLs in the code or use Vite env variables (see Vite docs).

3. **Run the frontend app:**
   ```bash
   npm run dev
   ```
   The app will run on `http://localhost:5173` by default.

## Main Pages

- `/login` — User login
- `/register` — User registration
- `/clients` — WhatsApp clients list & management
- `/scan-qr` — Scan WhatsApp QR code
- `/status` — Client status
- `/` — Dashboard

## Development

- Main entry: `src/main.js`
- Routing: `src/router.js`
- Components: `src/components/`

## License

MIT
