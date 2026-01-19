<template>
  <div class="fixed inset-0 bg-white/70 z-90 flex items-center justify-center flex flex-col gap-2">
    <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    {{ title }}
  </div>
</template>

<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: "Sedang memuat..."
  }
})

</script>

<style>

</style>