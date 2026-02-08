<template>
  <div class="min-h-screen bg-gray-50">
    <CardNavbarBack title="Riwayat Order" />
    <div class="px-4 pt-3">
      <div class="bg-gray-100 p-1 rounded-xl flex gap-1 w-fit mb-4">
        <button 
          v-for="(t, i) in tabs" 
          :key="i"
          class="px-3 py-1.5 rounded-lg text-xs font-bold border transition"
          :class="activeTab === t.key ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200'"
          @click="setActiveTab(t.key)"
        >
          {{ t.label }}
        </button>
      </div>
      <div class="flex flex-col gap-3 pb-24">
        <div 
          v-for="(o, i) in dataOrderList" 
          :key="`O-${i}`"
          class="bg-white rounded-[20px] border border-gray-100 p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition"
        >
          <div class="flex items-start justify-between">
            <div class="flex flex-col">
              <span class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Order ID</span>
              <span class="text-sm font-semibold text-gray-900">{{ o.order_id }}</span>
              <span class="text-[11px] text-gray-500 mt-1">{{ formatDateTime(o.created_at) }}</span>
            </div>
            <span class="px-3 py-1 rounded-lg text-[11px] font-bold border"
                  :class="o.status === 'WAITING' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : o.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-sky-50 text-sky-700 border-sky-100'">
              {{ o.status }}
            </span>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
            <div class="rounded-xl border border-gray-100 p-3">
              <div class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Customer</div>
              <div class="text-sm font-semibold text-gray-900">{{ o.customer_no }}</div>
            </div>
            <div class="rounded-xl border border-gray-100 p-3">
              <div class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Jumlah</div>
              <div class="text-sm font-semibold text-gray-900">{{ o.total_quantity }}</div>
            </div>
            <div class="rounded-xl border border-gray-100 p-3">
              <div class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Total</div>
              <div class="text-sm font-semibold text-gray-900">Rp {{ useString.setNumberFormat(o.total_price) }}</div>
            </div>
            <div class="rounded-xl border border-gray-100 p-3">
              <div class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Metode</div>
              <div class="text-sm font-semibold text-gray-900">{{ o.payment_method }}</div>
            </div>
          </div>
          <div class="mt-4 flex items-start gap-2 overflow-x-auto pb-2">
            <div
              v-for="(p, idx) in o.products || []"
              :key="`PRD-${idx}`"
              class="flex items-center gap-3 rounded-xl border border-gray-100 px-2 py-2 bg-white shadow-sm min-w-[220px]"
            >
              <NuxtImg :src="p?.products?.image" class="w-14 h-14 object-cover rounded-lg border" alt="Product"/>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-semibold text-gray-900 truncate">{{ p?.products?.name }}</div>
                <div class="text-[11px] text-gray-500">{{ p.quantity }}x • Rp {{ useString.setNumberFormat(p.unit_price * (1 - p.discount / 100)) }}</div>
              </div>
            </div>
          </div>
          <div v-if="o.note" class="mt-3 rounded-xl border border-gray-100 p-3">
            <div class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Catatan</div>
            <div class="text-sm font-semibold text-gray-900">{{ o.note }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useOrderStore } from '~/stores/order'
import { useUserStore } from '~/stores/user'
import type { Order } from '~/types/product'
import type { HistoryTransaction, Tiket } from '~/types/user'

const tabs = [
  {
    key: 'WAITING',
    label: 'Dalam Pengajuan'
  },
  {
    key: 'APPROVED',
    label: 'Disetujui'
  },
  {
    key: 'COMPLETED',
    label: 'Selesai'
  }
]
const activeTab = ref<string>("WAITING")
const route = useRoute()
const useOrder = useOrderStore()
const allOrdersCustomer = computed(() => useOrder?.orders?.filter(o => o.customer_no === route?.params?.id as string))
const orderWaiting = computed(() => allOrdersCustomer.value?.filter(o => o.status === 'WAITING'))
const orderApproved = computed(() => allOrdersCustomer.value?.filter(o => o.status === 'APPROVED'))
const orderCompleted = computed(() => allOrdersCustomer.value?.filter(o => o.status === 'COMPLETED'))
const dataOrderList = ref<Order[]>([])
const useString = useUseString()
const useStore = useUserStore()
const formatDateTime = (d?: string) => d ? new Date(d).toLocaleString('id-ID') : ''

const setDataOrder = (): Order[] => {
  switch (activeTab.value) {
    case 'APPROVED':
      return orderApproved.value
    case 'COMPLETED':
      return orderCompleted.value
    default:
      return orderWaiting.value
  }
}

const setActiveTab = (tab: string) => {
  activeTab.value = tab
  dataOrderList.value = setDataOrder()
}

onMounted(async () => {
  await useOrder.fetchOrder(route?.params?.id as string)
  dataOrderList.value = setDataOrder()
})

</script>

<style>
</style>
