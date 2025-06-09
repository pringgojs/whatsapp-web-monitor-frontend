import { createRouter, createWebHistory } from "vue-router";
import Login from "./components/Login.vue";
import HelloWorld from "./components/HelloWorld.vue";
import Dashboard from "./components/Dashboard.vue";
import ScanQR from "./components/ScanQR.vue";
import ClientStatus from "./components/ClientStatus.vue";
import ClientsList from "./components/ClientsList.vue";
import Register from "./components/Register.vue";
import ClientDetail from "./components/ClientDetail.vue";
import UserManagement from "./components/UserManagement.vue";

const routes = [
  { path: "/", name: "Dashboard", component: Dashboard },
  { path: "/scan-qr", name: "ScanQR", component: ScanQR },
  { path: "/status", name: "ClientStatus", component: ClientStatus },
  { path: "/clients", name: "ClientsList", component: ClientsList },
  { path: "/login", name: "Login", component: Login },
  { path: "/register", component: Register },
  {
    path: "/clients/:clientId",
    name: "ClientDetail",
    component: ClientDetail,
    meta: { requiresAuth: true },
  },
  {
    path: "/users",
    name: "UserManagement",
    component: UserManagement,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  // Rute lain seperti monitoring, dsb akan ditambahkan nanti
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Proteksi route: hanya user login yang bisa akses selain /login dan /register
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if (to.path !== "/login" && to.path !== "/register" && !token) {
    next("/login");
  } else if (to.path === "/login" && token) {
    next("/");
  } else {
    next();
  }
});

export default router;
