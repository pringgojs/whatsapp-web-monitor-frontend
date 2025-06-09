<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900"
  >
    <div
      class="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700 transition-all"
    >
      <h1
        class="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white tracking-tight"
      >
        Login
      </h1>
      <form @submit.prevent="login" class="flex flex-col gap-5">
        <PrelineInput
          v-model="email"
          type="email"
          placeholder="Email"
          :error="error && error.toLowerCase().includes('email') ? error : ''"
          :disabled="loading"
        />
        <div class="relative">
          <PrelineInput
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password"
            :error="
              error && error.toLowerCase().includes('password') ? error : ''
            "
            :disabled="loading"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            tabindex="-1"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 focus:outline-none"
          >
            <svg
              v-if="!showPassword"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <svg
              v-else
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.223-3.592m3.1-2.727A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.965 9.965 0 01-4.293 5.411M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 6L6 6"
              />
            </svg>
          </button>
        </div>
        <button
          type="submit"
          class="w-full py-3 mt-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-400 text-white font-semibold transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          :disabled="loading"
        >
          <span v-if="loading">
            <svg
              class="animate-spin h-5 w-5 inline-block mr-2 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
            Loading...
          </span>
          <span v-else>Login</span>
        </button>
      </form>
      <div class="mt-6 text-center text-gray-500 dark:text-gray-300">
        Belum punya akun?
        <router-link
          to="/register"
          class="text-emerald-600 hover:underline font-semibold"
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
import { notification } from "../composables/useNotification";
import PrelineInput from "./_PrelineInput.vue";

const router = useRouter();
const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);
const showPassword = ref(false);

const login = async () => {
  error.value = "";
  loading.value = true;
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.value, password: password.value }),
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem("token", data.token);
      notification("success", "Login berhasil!");
      router.push("/");
    } else {
      error.value = data.error || "Login gagal.";
      notification("error", error.value);
    }
  } catch (e) {
    error.value = "Login gagal.";
    notification("error", "Login gagal.");
  } finally {
    loading.value = false;
  }
};
</script>
