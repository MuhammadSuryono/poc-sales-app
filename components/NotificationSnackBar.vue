<script setup lang="ts">
import { useNotificationStore } from '~/stores/notification'

const notifStore = useNotificationStore()
const isVisible = computed(() => notifStore.visible)
const text = computed(() => notifStore.text)
</script>

<template>
  <transition name="fade">
    <div class="w-full" v-if="isVisible">
      <div class="fixed bottom-0 text-center items-center justify-center border border-color-5 p-3 bg-black text-white rounded box-shadow-full flex flex-col max-w-[300px]">
        <span class="text-sm">{{ text }}</span>
      </div>
    </div>
  </transition>
</template>


<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>