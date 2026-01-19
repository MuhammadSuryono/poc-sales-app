<template>
  <header class="flex justify-between items-center bg-white border-b p-3 fixed top-0 left-0 right-0 z-50 h-15">
    <div class="flex flex-row gap-4 justify-between items-center w-full">
      <div class="flex flex-row gap-4 items-center">
        <ArrowLeftIcon class="h-6 w-6 text-gray-700" @click="goToBack"/>
        <span class="font-normal text-base">{{ title }}</span>
      </div>
      <slot name="right"/>
    </div>
  </header>
</template>

<script lang="ts" setup>
import {
  ArrowLeftIcon
} from '@heroicons/vue/24/outline'

defineProps({
  title: {
    type: String,
    default: ''
  }
})

const goToBack = () => {
  useRouter().go(-1)
}

</script>

<style>

</style>