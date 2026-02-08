<template>
  <div class="grid grid-cols-2 gap-3">
    <!-- Customer Count -->
    <div class="stat-item-alt bg-teal-50 rounded-xl p-3 border border-teal-100 flex items-center gap-2">
      <div class="p-1.5 bg-teal-100 rounded-lg">
        <UserCircleIcon class="w-5 h-5 text-java-teal" />
      </div>
      <div class="flex flex-col">
        <span class="text-lg font-bold text-gray-800">{{ statistic?.TotalCustomer }}</span>
        <span class="text-[9px] font-bold text-teal-700 uppercase leading-none">Pelanggan</span>
      </div>
    </div>

    <!-- Transaction Total -->
    <div class="stat-item-alt bg-indigo-50 rounded-xl p-3 border border-indigo-100 flex items-center gap-2">
      <div class="p-1.5 bg-indigo-100 rounded-lg">
        <BanknotesIcon class="w-5 h-5 text-indigo-600" />
      </div>
      <div class="flex flex-col">
        <span class="text-lg font-bold text-gray-800">{{ useString.setShortNumberFormat(statistic?.totalTransaction ?? 0) }}</span>
        <span class="text-[9px] font-bold text-indigo-700 uppercase leading-none">Transaksi</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { UserCircleIcon, BanknotesIcon } from '@heroicons/vue/24/outline'
import { useUserStore } from '~/stores/user';
import type { User } from '~/types/user';
const userStore = useUserStore()
const user = computed(() => userStore?.user as User)
const statistic = computed(() => userStore?.getStatisticTransactionToday(user.value?.userId))
const useString = useUseString()

</script>

<style>

</style>