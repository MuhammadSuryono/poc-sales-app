<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  type?: string
}>()

const emit = defineEmits(['update:modelValue'])

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div>
    <label class="block text-sm font-medium text-gray-700" v-if="label">{{ label }}</label>
    <div
      class="flex flex-row gap-2 items-center border border-gray-300 rounded px-2 py-2 mt-1 focus-within:border-blue-500 transition-colors"
    >
      <slot name="icon" />
      <input
        :type="type || 'text'"
        :value="modelValue"
        @input="onInput"
        :placeholder="placeholder || 'Search...'"
        class="outline-none text-sm w-full"
        name="anything-random-{{ Math.random().toString(36).substring(7) }}"
      />
    </div>
  </div>
</template>
