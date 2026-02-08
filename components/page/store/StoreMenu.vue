<template>
  <div class="grid grid-cols-2 gap-4">
    <button 
      v-for="item in visibleMenuItems" 
      :key="item.label"
      @click="goTo(item.path)"
      class="flex flex-col items-center justify-center p-6 rounded-[28px] bg-white border border-gray-100 shadow-sm active:scale-95 transition-all w-full group"
    >
      <div class="w-14 h-14 flex items-center justify-center bg-java-teal/5 rounded-2xl border border-java-teal/10 mb-4 group-active:bg-java-teal/10 transition-colors">
        <component :is="item.icon" class="w-7 h-7 text-java-teal" />
      </div>
      <span class="text-[11px] font-black text-gray-700 uppercase tracking-widest text-center leading-tight">{{ item.label }}</span>
    </button>
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
  CurrencyDollarIcon,
} from '@heroicons/vue/24/outline'
import { useUserStore } from '~/stores/user'
import type { Tiket } from '~/types/user'

const route = useRoute()
const useStore = useUserStore()
const user = computed(() => useStore?.user)
const customerId = computed(() : string => route?.params?.id as string)
const allTiket = computed((): Tiket[] => useStore.getAllTiketUser()?.sort((a, b) => {
  return new Date(b?.last_updated).getTime() - new Date(a?.last_updated).getTime()
}))
const detailTiket = computed(() => {
  return allTiket.value.find((tiket) => tiket?.customer_no === customerId.value) as Tiket
})

const visibleMenuItems = computed(() => [
  {
    label: 'Informasi Toko',
    icon: BuildingStorefrontIcon,
    path: `/visit/store/${customerId.value}/information`,
    show: true
  },
  {
    label: 'Histori Kunjungan',
    icon: ArrowPathIcon,
    path: `/visit/store/${customerId.value}/history`,
    show: true
  },
  {
    label: 'Taking Order',
    icon: CalculatorIcon,
    path: `/visit/store/${customerId.value}/taking/order`,
    show: user.value?.role === 'SALES' && detailTiket.value?.visit_status === 'INPROGRESS'
  },
  {
    label: 'Reimbursement',
    icon: CurrencyDollarIcon,
    path: `/visit/store/${customerId.value}/reimbursement`,
    show: user.value?.role === 'SALES' && detailTiket.value?.visit_status === 'INPROGRESS'
  },
  {
    label: 'Order Status',
    icon: ShoppingBagIcon,
    path: `/visit/store/${customerId.value}/history/order`,
    show: user.value?.role === 'SALES'
  },
  {
    label: 'Histori Transaksi',
    icon: CreditCardIcon,
    path: `/visit/store/${customerId.value}/history/transaction`,
    show: true
  }
].filter(item => item.show))

const goTo = (path: string) => {
  navigateTo(path)
}
</script>

<style scoped>
@reference "../../../assets/css/main.css";

.menu-grid {
  @apply grid grid-cols-2 gap-4;
}

.menu-item-premium {
  @apply flex flex-col items-center justify-center p-6 rounded-[32px] border border-gray-100 bg-white transition-all hover:shadow-xl hover:-translate-y-1 active:scale-95 text-center;
}

.icon-box {
  @apply w-16 h-16 flex items-center justify-center bg-java-teal/5 rounded-3xl border border-java-teal/10 mb-4;
}

.label-box {
  @apply relative;
}

.menu-label {
  @apply text-[11px] font-black text-gray-700 uppercase tracking-widest leading-none;
}

.menu-indicator {
  @apply h-0.5 w-0 bg-java-green mx-auto mt-2 rounded-full;
}

.glass-light {
  @apply backdrop-blur-sm bg-white/80;
}
</style>