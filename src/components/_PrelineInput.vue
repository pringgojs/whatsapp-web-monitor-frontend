<template>
  <div class="relative">
    <input
      :type="type"
      :placeholder="placeholder"
      v-model="modelValueProxy"
      :class="[
        'block w-full px-4 py-3 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none',
        error
          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-400'
          : 'focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400',
        disabled ? 'opacity-60 cursor-not-allowed' : '',
      ]"
      :disabled="disabled"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <span v-if="error" class="absolute left-0 -bottom-5 text-xs text-red-500">{{
      error
    }}</span>
  </div>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  modelValue: String,
  type: { type: String, default: "text" },
  placeholder: String,
  error: String,
  disabled: Boolean,
});
const emit = defineEmits(["update:modelValue"]);
const modelValueProxy = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});
</script>
