<template>
  <div class="flex flex-row gap-2 justify-between items-center text-center border rounded-sm py-3" style="box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <div class="flex flex-col gap-1 px-2 sm:px-3 md:px-5">
      <span class="font-bold text-md sm:text-lg">{{ allTiket.length }}</span>
      <span class="text-xs sm:text-sm text-gray-400">Daftar Kunjungan</span>
    </div>
    <div class="flex flex-col gap-1 border-l px-2 sm:px-3 md:px-4 lg:px-5">
      <span class="font-bold text-md sm:text-lg">{{ allTiketTodo.length }}</span>
      <span class="text-xs sm:text-sm text-gray-400">Belum Dikunjungi</span>
    </div>
    <div class="flex flex-col gap-1 border-l px-2 sm:px-3 md:px-4 lg:px-5">
      <span class="font-bold text-md sm:text-lg">{{ allTiketInProgress.length }}</span>
      <span class="text-xs sm:text-sm text-gray-400">Sedang Dikunjungi</span>
    </div>
    <div class="flex flex-col gap-1 border-l px-2 sm:px-3 md:px-4 lg:px-5">
      <span class="font-bold text-md sm:text-lg">{{ allTiketFinish.length }}</span>
      <span class="text-xs sm:text-sm text-gray-400">Sudah Dikunjungi</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '~/stores/user'
import type { Tiket } from '~/types/user'

const allTiket = computed((): Tiket[] => useUserStore().getAllTiketUser())
const allTiketTodo = computed((): Tiket[] => allTiket.value.filter(tiket => tiket.visitStatus === 'TODO'))
const allTiketInProgress = computed((): Tiket[] => allTiket.value.filter(tiket => tiket.visitStatus === 'INPROGRESS'))
const allTiketFinish = computed((): Tiket[] => allTiket.value.filter(tiket => tiket.visitStatus === 'FINISH'))

</script>

<style>

</style>