<template>
  <div ref="menuRoot" class="relative inline-block text-left">
    <span
      @click.stop="toggleMenu"
      @keydown.enter.space="toggleMenu"
      tabindex="0"
      role="button"
      aria-haspopup="true"
      :aria-expanded="open"
    >
      <slot name="trigger" />
    </span>
    <transition name="fade">
      <div
        v-if="open"
        class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5 z-30 focus:outline-none"
        @keydown.esc="closeMenu"
        tabindex="-1"
        ref="menuPanel"
      >
        <div class="py-1">
          <slot />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onUnmounted, nextTick } from "vue";
const open = ref(false);
const menuRoot = ref(null);
const menuPanel = ref(null);

function toggleMenu(e) {
  open.value = !open.value;
  if (open.value) {
    nextTick(() => {
      menuPanel.value?.focus();
    });
  }
  if (e) e.stopPropagation();
}
function closeMenu() {
  open.value = false;
}
function onDocumentClick(e) {
  if (!menuRoot.value?.contains(e.target)) {
    closeMenu();
  }
}
document.addEventListener("mousedown", onDocumentClick);
onUnmounted(() => {
  document.removeEventListener("mousedown", onDocumentClick);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
