<template>
  <div
    class="max-w-sm mx-auto mt-16 p-8 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 shadow-lg"
  >
    <nav
      class="mb-6 text-sm text-gray-500 dark:text-gray-300 flex items-center gap-1"
    >
      <router-link to="/" class="text-emerald-600 hover:underline"
        >Home</router-link
      >
      <span>/</span>
      <span>Register</span>
    </nav>
    <h2
      class="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white"
    >
      Register
    </h2>
    <form @submit.prevent="handleRegister" class="flex flex-col gap-4">
      <div>
        <label class="block mb-1 font-semibold text-gray-700 dark:text-gray-200"
          >Email</label
        >
        <input
          v-model="email"
          type="email"
          required
          class="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
      </div>
      <div>
        <label class="block mb-1 font-semibold text-gray-700 dark:text-gray-200"
          >Password</label
        >
        <input
          v-model="password"
          type="password"
          required
          class="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
      </div>
      <div>
        <label class="block mb-1 font-semibold text-gray-700 dark:text-gray-200"
          >Role</label
        >
        <select
          v-model="role"
          required
          class="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>
      <button
        type="submit"
        class="w-full py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors mt-2"
      >
        Register
      </button>
      <div v-if="error" class="text-red-500 mt-2 text-center">{{ error }}</div>
      <div v-if="success" class="text-emerald-600 mt-2 text-center">
        {{ success }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { API_BASE_URL } from "../config";
import { notification } from "../composables/useNotification";

const email = ref("");
const password = ref("");
const role = ref("user");
const error = ref("");
const success = ref("");
const router = useRouter();

const handleRegister = async () => {
  error.value = "";
  success.value = "";
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
        role: role.value,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      success.value = "Registrasi berhasil. Silakan login.";
      notification("success", "Registrasi berhasil! Silakan login.");
      setTimeout(() => router.push("/login"), 1200);
    } else {
      error.value = data.error || "Registrasi gagal";
      notification("error", error.value);
    }
  } catch (e) {
    error.value = "Terjadi kesalahan koneksi";
    notification("error", "Registrasi gagal.");
  }
};
</script>
