<template>
  <div class="flex flex-row gap-2 justify-between items-center border rounded-sm py-3 px-3" style="box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <div class="flex flex-row gap-1">
      <UserCircleIcon class="w-8 h-8 text-primary" />
      <div class="flex flex-col">
        <span class="text-sm font-bold">{{ statistic?.TotalCustomer }}</span>
        <span class="text-xs font-normal text-gray-400">Pelanggan</span>
      </div>
    </div>
    <div class="flex flex-row gap-1">
      <BanknotesIcon class="w-8 h-8 text-primary" />
      <div class="flex flex-col">
        <span class="text-sm font-bold">{{ useString.setNumberFormat(statistic?.totalTransaction ?? 0) }}</span>
        <span class="text-xs font-normal text-gray-400">Transaksi</span>
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