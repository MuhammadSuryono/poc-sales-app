<template>
  <div>
    <CardNavbarBack title="Riwayat Order" />
    <div class="flex text-sm py-4 box-shadow-bottom border-b text-gray-700">
      <div class="px-4 py-3 transition cursor-pointer" v-for="(t, i) in tabs" :class="{'active-tab': activeTab === t.key}" @click="setActiveTab(t.key)">{{ t.label }}</div>
    </div>
    <div class="space-y-4">
      <!-- Order Card -->
      <div class="border rounded-xl shadow-sm hover:shadow-md transition bg-white p-4" v-for="(o, i) in dataOrderList" :key="`O-${i}`">
        <div class="flex justify-between items-center mb-2">
          <div>
            <div class="text-sm text-gray-500">Order ID:</div>
            <div class="font-medium text-gray-800">{{ o.OrderId }}</div>
          </div>
          <div class="text-sm px-3 py-1 rounded-full font-semibold" 
              @click="updateMockStatusToCompleted(o)"
              :class="{'bg-yellow-100 text-yellow-800': o.Status === 'WAITING', 'bg-green-100 text-green-800': o.Status === 'COMPLETED', 'bg-blue-100 text-blue-800': o.Status === 'APPROVED'}">
            {{ o.Status }}
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-gray-600 mb-4">
          <div><span class="font-medium">Customer:</span> {{ o.CustomerNo }}</div>
          <div><span class="font-medium">Qty:</span> {{ o.TotalQuantity }}</div>
          <div><span class="font-medium">Total:</span> {{ useString.setNumberFormat(o.TotalPrice) }}</div>
          <div><span class="font-medium">Metode:</span> {{ o.PaymentMethod }}</div>
        </div>

        <div class="flex items-center gap-2 overflow-x-auto pb-2">
          <!-- Product Preview -->
          <div class="flex items-center gap-2 border rounded-md px-2 py-1 shadow-sm" v-for="(p, idx) in o.Products?.slice(0, 2)" :key="`PRD-${idx}`">
            <img :src="p.Image" alt="" class="w-10 h-10 rounded object-cover w-[20%]">
            <div class="text-sm max-w-[80%]">
              <div class="font-semibold truncate">{{  p.Name }}</div>
              <div class="text-xs text-gray-500">{{ p.Quantity }}x • {{ useString.setNumberFormat(p.Price * (1 - p.Discount / 100)) }}</div>
            </div>
          </div>

          <!-- Add more product previews as needed -->
        </div>
      </div>

      <!-- Repeat more cards for each order -->
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
const allOrdersCustomer = computed(() => useOrder?.orders?.filter(o => o.CustomerNo === route?.params?.id as string))
const orderWaiting = computed(() => allOrdersCustomer.value?.filter(o => o.Status === 'WAITING'))
const orderApproved = computed(() => allOrdersCustomer.value?.filter(o => o.Status === 'APPROVED'))
const orderCompleted = computed(() => allOrdersCustomer.value?.filter(o => o.Status === 'COMPLETED'))
const dataOrderList = ref<Order[]>([])
const useString = useUseString()
const useStore = useUserStore()

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

const updateMockStatusToCompleted = (order: Order) => {
  if (order.Status === 'APPROVED') {
    order.Status = 'COMPLETED'
    const customerId = route?.params?.id as string
    useStore?.updateStatisticStore(customerId, order?.TotalQuantity, order?.TotalPrice)
    const tiket = useStore?.getAllTiketUser()?.find(t => t?.customerNo === customerId)
    if (tiket) {
      tiket.balance += order.TotalPrice
      const newDataCollector: Tiket = {
        ...tiket
      }
      newDataCollector.userId = 'collector'
      newDataCollector.visitStatus = 'TODO'

      const invoice: HistoryTransaction = {
        amount: order?.TotalPrice ?? 0,
        customerId: customerId,
        invoiceNo: `INV-${Date.now()}`,
        orderDate: (new Date()).toISOString(),
        postingDate: (new Date()).toISOString(),
        type: 'ORDER'
      }
      useStore?.$patch(state => {
        state?.allTiket?.push(newDataCollector)
        state?.historyTransaction?.push(invoice)
      })
    }
  }
}

const setActiveTab = (tab: string) => {
  activeTab.value = tab
  dataOrderList.value = setDataOrder()
}

onMounted(() => {
  dataOrderList.value = setDataOrder()
})

</script>

<style>
.active-tab {
  border-color: var(--color-primary);
  border-width: 0 0 3px 0;
  color: var(--color-primary);  
}

</style>