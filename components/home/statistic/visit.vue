<template>
  <div class="grid grid-cols-2 gap-2 sm:gap-3">
    <!-- Total Kunjungan -->
    <div class="stat-item bg-gray-50 rounded-xl p-2.5 border border-gray-100 flex flex-col items-center justify-center">
      <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Total</span>
      <span class="text-xl font-extrabold text-gray-800">{{ allTiket.length }}</span>
    </div>

    <!-- Belum Dikunjungi (Todo) -->
    <div class="stat-item bg-yellow-50 rounded-xl p-2.5 border border-yellow-100 flex flex-col items-center justify-center">
      <span class="text-[10px] text-yellow-600 font-bold uppercase tracking-wider mb-0.5">Pending</span>
      <span class="text-xl font-extrabold text-java-teal">{{ allTiketTodo.length }}</span>
    </div>

    <!-- Sedang Dikunjungi (In-Progress) -->
    <div class="stat-item bg-blue-50 rounded-xl p-2.5 border border-blue-100 flex flex-col items-center justify-center">
      <span class="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-0.5">Active</span>
      <span class="text-xl font-extrabold text-primary">{{ allTiketInProgress.length }}</span>
    </div>

    <!-- Sudah Dikunjungi (Finish) -->
    <div class="stat-item bg-green-50 rounded-xl p-2.5 border border-green-100 flex flex-col items-center justify-center">
      <span class="text-[10px] text-green-600 font-bold uppercase tracking-wider mb-0.5">Done</span>
      <span class="text-xl font-extrabold text-success">{{ allTiketFinish.length }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '~/stores/user'
import type { Tiket } from '~/types/user'

const allTiket = computed((): Tiket[] => useUserStore().getAllTiketUser())
const allTiketTodo = computed((): Tiket[] => allTiket.value.filter(tiket => tiket.visit_status === 'TODO'))
const allTiketInProgress = computed((): Tiket[] => allTiket.value.filter(tiket => tiket.visit_status === 'INPROGRESS'))
const allTiketFinish = computed((): Tiket[] => allTiket.value.filter(tiket => tiket.visit_status === 'FINISH'))

</script>

<style>

</style>