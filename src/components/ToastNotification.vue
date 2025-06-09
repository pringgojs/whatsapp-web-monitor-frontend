<template>
  <div
    v-if="notificationState.show"
    :class="[
      'fixed top-6 right-6 z-50 px-6 py-3 rounded shadow-lg text-white',
      notificationState.type === 'success' ? 'bg-emerald-600' : 'bg-red-600',
    ]"
  >
    {{ notificationState.message }}
  </div>
</template>

<script setup>
import { notificationState } from "../composables/useNotification";
</script>
