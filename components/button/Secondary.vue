<template>
  <button class="flex flex-row gap-2 items-center justify-center rounded-xs border border-gray-300 px-6 text-base font-medium flex flex-row gap-2  cursor-pointer hover:bg-gray-100"
  :disabled="disabled"
  :class="{
    'px-4 py-2 max-sm:py-1': size === 'md',
    'px-2 py-1': size === 'sm'
  }"
  :loading="loading"
  @click="onClick"
  >
    <slot name="icon" />
    {{ text }}
  </button>
</template>

<script lang="ts" setup>
defineProps({
  size: {
    type: String,
    default: 'md'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: ''
  },
  onClick: {
    type: Function as PropType<() => void>,
    default: () => {}
  }
})
</script>

<style>

</style>