<template>
  <transition name="fade">
    <div
      v-if="open"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40"
    >
      <div
        class="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 min-w-[340px] w-full max-w-xs flex flex-col items-center border border-gray-100 dark:border-gray-800"
      >
        <button
          @click="handleClose"
          class="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
          aria-label="Tutup"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <slot name="icon">
          <svg
            class="w-12 h-12 text-emerald-500 mb-2"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="2"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 8v4m0 4h.01"
            />
          </svg>
        </slot>
        <h3
          class="text-xl font-bold text-gray-700 dark:text-gray-100 text-center mt-2 mb-1"
        >
          {{ title }}
        </h3>
        <p class="text-gray-600 dark:text-gray-300 text-center text-base mb-2">
          {{ description }}
        </p>
        <div class="flex gap-3 justify-center mt-2 w-full">
          <button
            @click="handleYes"
            class="flex-1 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition text-base shadow focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            {{ yesText || "Ya" }}
          </button>
          <button
            @click="handleClose"
            class="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold transition text-base shadow focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            {{ noText || "Batal" }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
const props = defineProps({
  open: Boolean,
  title: String,
  description: String,
  yesText: String,
  noText: String,
  onYes: Function,
  onClose: Function,
});
const emit = defineEmits(["yes", "close"]);

async function handleYes() {
  if (props.onYes) await props.onYes();
  emit("yes");
}
async function handleClose() {
  if (props.onClose) await props.onClose();
  emit("close");
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
