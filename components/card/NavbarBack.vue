<template>
  <header class="flex justify-between items-center bg-java-dark p-3 fixed top-0 left-0 right-0 z-50 h-15">
    <div class="flex flex-row gap-4 justify-between items-center w-full">
      <div class="flex flex-row gap-4 items-center">
        <button @click="useRouter().go(-1)" class="back-btn group">
          <ArrowLeftIcon class="h-6 w-6 text-white group-active:scale-90 transition-transform" />
        </button>
        <span class="text-lg font-bold text-white tracking-tight">{{ title }}</span>
      </div>
      <slot name="right"></slot>
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

</script>

<style scoped>
@reference "../../assets/css/main.css";
.back-btn {
  @apply p-2 rounded-2xl bg-white/10 hover:bg-white/20 transition-all shadow-lg border border-white/5;
}
</style>