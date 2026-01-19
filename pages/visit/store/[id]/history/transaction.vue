<template>
  <div>
    <CardNavbarBack title="Riwayat Transaksi" />

    <div class="px-3 py-1">
      <div class="bg-white rounded-sm box-shadow-full flex flex-col gap-1 w-full text-sm px-3 py-2 border" v-for="(dt, i) in histories">
        <div class="flex flex-row justify-between items-center w-full">
          <span class="text-sm text-gray-400">#{{ dt?.invoiceNo }}</span>
          <div class="text-sm px-3 py-1 rounded-full font-semibold" 
              :class="{'bg-yellow-100 text-yellow-800': dt.type === 'ORDER', 'bg-green-100 text-green-800': dt.type === 'PAYMENT'}">
            {{ dt.type }}
          </div>
        </div>
        <span>Order Date <br/><span class="text-gray-400">{{ useString?.setDateFormat(new Date(dt?.orderDate)) }}</span></span>
        <div class="flex flex-row justify-between items-center">
          <span>Posting Date <br/><span class="text-gray-400">{{ useString?.setDateFormat(new Date(dt?.postingDate)) }}</span></span>
          <span>Amount <br/><span class="font-semibold">{{ useString?.setNumberFormat(dt?.amount ?? 0)}}</span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '~/stores/user';

const useStore = useUserStore()
const customerId = useRoute()?.params?.id as string
const histories = computed(() => useStore?.historyTransaction?.filter(h => h.customerId === customerId))
const useString = useUseString()

</script>

<style>

</style>