<template>
  <div>
    <Navbar v-if="showNavbar" />
    <RouterView />
    <ToastNotification />
  </div>
</template>

<script setup>
import { RouterView, useRoute } from "vue-router";
import ToastNotification from "./components/ToastNotification.vue";
import Navbar from "./components/Navbar.vue";
import { computed } from "vue";

const route = useRoute();
const showNavbar = computed(
  () => !["/login", "/register"].includes(route.path)
);
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
