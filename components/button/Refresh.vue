<template>
  <div class="flex flex-row gap-1 items-center justify-center cursor-pointer mt-3 text-gray-400" @click="onClick">
    <ArrowPathIcon class="h-6 w-6" />
    Refresh
  </div>
</template>

<script lang="ts" setup>
import { ArrowPathIcon } from '@heroicons/vue/24/outline'
const emit = defineEmits(['action'])

const onClick = () => {
  emit('action')
}

</script>

<style>

</style>