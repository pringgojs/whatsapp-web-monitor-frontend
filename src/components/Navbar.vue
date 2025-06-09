<template>
  <nav
    class="bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-0 z-40"
  >
    <div
      class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16"
    >
      <!-- Left: Brand -->
      <router-link
        to="/"
        class="flex items-center gap-2 font-bold text-lg text-emerald-600 dark:text-emerald-400 hover:opacity-80"
      >
        <svg
          class="w-7 h-7"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3 12l2-2m0 0l7-7 7 7m-9 2v7a2 2 0 002 2h4a2 2 0 002-2v-7m-6 0h6"
          />
        </svg>
        WhatsApp Monitor
      </router-link>
      <!-- Center: Main Menu -->
      <ul
        class="hidden md:flex gap-2 items-center font-semibold text-gray-700 dark:text-gray-200"
      >
        <li>
          <router-link
            to="/"
            class="px-3 py-2 rounded hover:bg-emerald-50 dark:hover:bg-gray-800 transition"
            >Dashboard</router-link
          >
        </li>
        <li
          class="relative"
          @mouseenter="openClientMenu"
          @mouseleave="closeClientMenu"
        >
          <button
            class="px-3 py-2 rounded hover:bg-emerald-50 dark:hover:bg-gray-800 transition flex items-center gap-1"
          >
            Client
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <ul
            v-show="showClientMenu"
            class="absolute left-0 mt-2 min-w-[160px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow-lg transition-opacity duration-200 z-20"
            @mouseenter="openClientMenu"
            @mouseleave="closeClientMenu"
          >
            <li>
              <router-link
                to="/clients"
                class="block px-4 py-2 hover:bg-emerald-50 dark:hover:bg-gray-800 rounded"
                >Daftar Client</router-link
              >
            </li>
            <li>
              <router-link
                to="/scan-qr"
                class="block px-4 py-2 hover:bg-emerald-50 dark:hover:bg-gray-800 rounded"
                >Scan QR</router-link
              >
            </li>
            <li>
              <router-link
                to="/status"
                class="block px-4 py-2 hover:bg-emerald-50 dark:hover:bg-gray-800 rounded"
                >Status Client</router-link
              >
            </li>
          </ul>
        </li>
        <li v-if="isAdmin">
          <router-link
            to="/users"
            class="px-3 py-2 rounded hover:bg-emerald-50 dark:hover:bg-gray-800 transition"
            >User Management</router-link
          >
        </li>
      </ul>
      <!-- Right: Auth/Profile -->
      <div class="flex items-center gap-2">
        <button
          v-if="isDark"
          @click="toggleDark(false)"
          class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          title="Light Mode"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </button>
        <button
          v-else
          @click="toggleDark(true)"
          class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          title="Dark Mode"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
            />
          </svg>
        </button>
        <button
          v-if="isLoggedIn"
          @click="logout"
          class="px-3 py-2 rounded bg-red-50 dark:bg-gray-800 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-gray-700 font-semibold transition"
        >
          Logout
        </button>
        <router-link
          v-else
          to="/login"
          class="px-3 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 font-semibold transition"
          >Login</router-link
        >
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isLoggedIn = computed(() => !!localStorage.getItem("token"));
const isAdmin = computed(() => {
  // Implementasi sederhana, bisa diubah sesuai backend
  try {
    const payload = JSON.parse(
      atob(localStorage.getItem("token")?.split(".")[1] || "")
    );
    return payload.role === "admin";
  } catch {
    return false;
  }
});

const themePref = ref(localStorage.getItem("theme"));
const isDark = ref(false);

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
    isDark.value = true;
  } else {
    root.classList.remove("dark");
    isDark.value = false;
  }
}

function detectSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function setTheme(theme) {
  localStorage.setItem("theme", theme);
  themePref.value = theme;
  applyTheme(theme);
}

function toggleDark(forceDark) {
  const theme = forceDark ? "dark" : "light";
  setTheme(theme);
}

onMounted(() => {
  // Cek preferensi user di localStorage, jika tidak ada ikuti OS
  let theme = localStorage.getItem("theme");
  if (!theme) {
    theme = detectSystemTheme();
  }
  applyTheme(theme);
  // Update jika user ganti preferensi OS, kecuali sudah override manual
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        applyTheme(e.matches ? "dark" : "light");
      }
    });
});

watch(themePref, (val) => {
  applyTheme(val);
});

function logout() {
  localStorage.removeItem("token");
  router.push("/login");
}
const showClientMenu = ref(false);
let submenuTimer = null;
function openClientMenu() {
  clearTimeout(submenuTimer);
  showClientMenu.value = true;
}
function closeClientMenu() {
  submenuTimer = setTimeout(() => {
    showClientMenu.value = false;
  }, 120); // delay agar user bisa pindah ke submenu
}
</script>
