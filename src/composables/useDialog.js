import { ref } from "vue";

const isOpen = ref(false);
const dialogTitle = ref("");
const dialogDescription = ref("");
const yesText = ref("");
const noText = ref("");
let yesHandler = null;
let closeHandler = null;

function openDialog({
  title,
  description,
  onYes,
  onClose,
  yes = "Ya",
  no = "Batal",
}) {
  dialogTitle.value = title;
  dialogDescription.value = description;
  yesText.value = yes;
  noText.value = no;
  yesHandler = async () => {
    try {
      if (onYes) await onYes();
    } finally {
      isOpen.value = false;
    }
  };
  closeHandler = async () => {
    try {
      if (onClose) await onClose();
    } finally {
      isOpen.value = false;
    }
  };
  isOpen.value = true;
}

function closeDialog() {
  isOpen.value = false;
  if (closeHandler) closeHandler();
}

export function useDialog() {
  return {
    isOpen,
    dialogTitle,
    dialogDescription,
    yesText,
    noText,
    openDialog,
    closeDialog,
    get onYes() {
      return yesHandler;
    },
    get onClose() {
      return closeHandler;
    },
  };
}
