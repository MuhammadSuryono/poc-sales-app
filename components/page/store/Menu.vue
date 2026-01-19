<template>
  <div class="rounded-md bg-white p-2 items-center justify-center flex flex-col gap-10 text-center">
    <div class="flex flex-row justify-start gap-5 items-center">
      <div class="flex flex-col gap-1 items-center">
        <div class="items-end justify-end shadow-full px-2 bg-[#E5F5E0] rounded-lg" @click="goTo(`/visit/store/${customerId}/information`)">
          <BuildingStorefrontIcon class="w-10 h-10 rounded-full text-primary mt-2" />
        </div>
        <span class="text-xs text-gray-400">Informasi Toko</span>
      </div>
      <div class="flex flex-col gap-1 items-center" @click="goTo(`/visit/store/${customerId}/history`)">
        <div class="items-end justify-end shadow-full px-2 bg-[#E5F5E0] rounded-lg">
          <ArrowPathIcon class="w-10 h-10 rounded-full text-primary mt-2" />
        </div>
        <span class="text-xs text-gray-400">Histori Kunjungan</span>
      </div>
      <!-- <div class="flex flex-col gap-1 items-center" @click="goTo(`/visit/store/${customerId}/balance`)">
        <div class="items-end justify-end shadow-full px-2 bg-[#E5F5E0] rounded-lg">
          <BanknotesIcon class="w-10 h-10 rounded-full text-primary mt-2" />
        </div>
        <span class="text-xs text-gray-400">Balance</span>
      </div>       -->
      <div class="flex flex-col gap-1 items-center" 
        v-if="user?.role === 'SALES' && detailTiket?.visitStatus === 'INPROGRESS'"
        @click="goTo(`/visit/store/${customerId}/taking/order`)">
        <div class="items-end justify-end shadow-full px-2 bg-[#E5F5E0] rounded-lg">
          <CalculatorIcon class="w-10 h-10 rounded-full text-primary mt-2" />
        </div>
        <span class="text-xs text-gray-400">Taking Order</span>
      </div>
      <div class="flex flex-col gap-1 items-center" @click="goTo(`/visit/store/${customerId}/history/order`)"
        v-if="user?.role === 'SALES'">
        <div class="items-end justify-end shadow-full px-2 bg-[#E5F5E0] rounded-lg">
          <ShoppingBagIcon class="w-10 h-10 rounded-full text-primary mt-2" />
        </div>
        <span class="text-xs text-gray-400">Order Status</span>
      </div>
      <div class="flex flex-col gap-1 items-center" @click="goTo(`/visit/store/${customerId}/history/transaction`)">
        <div class="items-end justify-end shadow-full px-2 bg-[#E5F5E0] rounded-lg">
          <CreditCardIcon class="w-10 h-10 rounded-full text-primary mt-2" />
        </div>
        <span class="text-xs text-gray-400">Histori Transaksi</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ShoppingBagIcon,
  ArrowPathIcon,
  BanknotesIcon,
  CalculatorIcon,
  CreditCardIcon,
  BuildingStorefrontIcon,
} from '@heroicons/vue/24/outline'
import { useUserStore } from '~/stores/user'
import type { Tiket } from '~/types/user'

const goTo = (path : string) => {
  navigateTo(path)
}

const route = useRoute()
const useStore = useUserStore()
const user = computed(() => useStore?.user)
const customerId = computed(() : string => route?.params?.id as string)
const allTiket = computed((): Tiket[] => useStore.getAllTiketUser()?.sort((a, b) => {
  return new Date(b?.lastUpdated).getTime() - new Date(a?.lastUpdated).getTime()
}))
const detailTiket = computed(() => {
  return allTiket.value.find((tiket) => tiket?.customerNo === customerId.value) as Tiket
})

</script>

<style>
.shadow-full {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>