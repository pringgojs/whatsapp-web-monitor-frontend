import { createRouter, createWebHistory } from "vue-router";
import Login from "./components/Login.vue";
import HelloWorld from "./components/HelloWorld.vue";
import Dashboard from "./components/Dashboard.vue";
import ScanQR from "./components/ScanQR.vue";

const routes = [
  { path: "/", name: "Dashboard", component: Dashboard },
  { path: "/scan-qr", name: "ScanQR", component: ScanQR },
  { path: "/login", name: "Login", component: Login },
  // Rute lain seperti monitoring, dsb akan ditambahkan nanti
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Proteksi route: hanya user login yang bisa akses selain /login
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if (to.path !== "/login" && !token) {
    next("/login");
  } else if (to.path === "/login" && token) {
    next("/");
  } else {
    next();
  }
});

export default router;
