import { ref } from "vue";

const notificationState = ref({ show: false, message: "", type: "success" });

export function useNotification() {
  function notify(type, message) {
    notificationState.value = { show: true, message, type };
    setTimeout(() => (notificationState.value.show = false), 3000);
  }
  return { notificationState, notify };
}

// Untuk akses global
export function notification(type, message) {
  notificationState.value = { show: true, message, type };
  setTimeout(() => (notificationState.value.show = false), 3000);
}

export { notificationState };
