<template>
  <div class="grid grid-cols-1 gap-2 sm:gap-3">
    <!-- Sudah Dikunjungi (Finish) -->
    <div class="stat-item bg-green-50 rounded-xl p-2.5 border border-green-100 flex flex-col items-center justify-center">
      <span class="text-[10px] text-green-600 font-bold uppercase tracking-wider mb-0.5">Total Kunjungan</span>
      <span class="text-xl font-extrabold text-success">{{ allTiketFinish.length }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '~/stores/user'
import type { Tiket } from '~/types/user'

const allTiket = computed((): Tiket[] => useUserStore().getAllTiketUser())
const allTiketFinish = computed((): Tiket[] => allTiket.value.filter(tiket => tiket.visit_status === 'FINISH'))

</script>

<style>

</style>