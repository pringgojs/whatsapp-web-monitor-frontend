<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900"
  >
    <div
      class="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
    >
      <h1
        class="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white"
      >
        Login
      </h1>
      <form @submit.prevent="login" class="flex flex-col gap-4">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <button
          type="submit"
          class="w-full py-3 mt-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
          :disabled="loading"
        >
          {{ loading ? "Loading..." : "Login" }}
        </button>
        <div v-if="error" class="text-red-500 text-center mt-2">
          {{ error }}
        </div>
      </form>
      <div class="mt-6 text-center text-gray-500 dark:text-gray-300">
        Belum punya akun?
        <router-link to="/register" class="text-blue-600 hover:underline"
          >Register</router-link
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { API_BASE_URL } from "../config";

const router = useRouter();
const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

const login = async () => {
  error.value = "";
  loading.value = true;
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });
    const data = await response.json();
    if (response.ok && data.token) {
      localStorage.setItem("token", data.token);
      router.push("/");
    } else {
      error.value = data.error || "Login gagal.";
    }
  } catch (e) {
    error.value = "Login gagal.";
  } finally {
    loading.value = false;
  }
};
</script>
