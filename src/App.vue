<template>
  <div>
    <Navbar v-if="showNavbar" />
    <RouterView />
    <ToastNotification />
    <GlobalDialog
      :open="isOpen"
      :title="dialogTitle"
      :description="dialogDescription"
      :yesText="yesText"
      :noText="noText"
      :onYes="onYes"
      :onClose="onClose"
    />
  </div>
</template>

<script setup>
import { RouterView, useRoute } from "vue-router";
import ToastNotification from "./components/ToastNotification.vue";
import Navbar from "./components/Navbar.vue";
import GlobalDialog from "./components/GlobalDialog.vue";
import { computed } from "vue";
import { useDialog } from "./composables/useDialog";

const route = useRoute();
const showNavbar = computed(
  () => !["/login", "/register"].includes(route.path)
);

const {
  isOpen,
  dialogTitle,
  dialogDescription,
  yesText,
  noText,
  onYes,
  onClose,
} = useDialog();
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
