<template>
  <button class="flex flex-row gap-2 items-center justify-center rounded-xs text-base font-medium text-white bg-success hover:bg-success-hover cursor-pointer"
  :class="{
    'px-4 py-2': size === 'md',
    'px-2 py-1': size === 'sm'
  }"
  :disabled="disabled"
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