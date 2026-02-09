<template>
  <div class="page-container no-scrollbar">
    <CardNavbarBack title="Detail Toko">
      <template #right>
        <NavbarCart class="cart-btn-white" />
      </template>
    </CardNavbarBack>
    <div v-if="!isSubPage" class="bg-gradient-java-hero safe-area-top pb-24 relative mt-8">
      <div class="absolute inset-0">
        <div class="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/5 blur-2xl"></div>
        <div class="absolute -bottom-8 -right-10 w-56 h-56 rounded-full bg-java-green/10 blur-3xl"></div>
      </div>
      <div class="px-5 mt-10 relative z-10">
        <div class="bg-white rounded-[24px] p-6 border border-gray-100 shadow-md animate-scale-in mb-4">
          <div class="flex items-center gap-5">
            <div class="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0 border border-gray-100">
              <BuildingStorefrontIcon class="h-8 w-8 text-java-teal" />
            </div>
            <div class="flex-1 min-w-0">
              <h1 class="text-xl font-bold text-gray-800 leading-tight truncate">
                {{ detailTiket?.customer_name }}
              </h1>
              <div class="flex items-center gap-3">
                <span class="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">{{ detailTiket?.customer_no }}</span>
              </div>
              <div class="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                <div class="flex flex-col min-w-0">
                  <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Telepon</span>
                  <span class="text-sm text-gray-700 truncate">{{ detailTiket?.customer_phone || '-' }}</span>
                </div>
                <div class="flex flex-col min-w-0">
                  <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Alamat</span>
                  <span class="text-sm text-gray-700 truncate">{{ detailTiket?.alamat || '-' }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-between mt-4 border-t pt-2">
            <div class="flex items-center gap-2">
              <MapPinIcon class="h-7 w-7 animate-pulse" :class="insideRadius ? 'text-java-green' : 'text-red-500'" />
              <div class="flex flex-col">
                <p class="text-[13px] text-gray-800 font-semi-bold leading-tight">
                  Anda berada <span class="text-java-teal inline-flex items-center gap-1 font-bold">{{ distance }}</span> dari lokasi
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- Glass blur stats above info card -->
        <div v-if="detailTiket?.visit_status === 'INPROGRESS'"  class="glass rounded-[24px] p-5 border border-white/20 mb-2 shadow-2xl">
          <div class="grid grid-cols-2 gap-4 items-start">
            <div class="flex flex-col">
              <span class="text-[10px] font-black text-white/70 uppercase tracking-widest">Check IN</span>
              <span class="text-sm font-semi-bold text-white mt-1">
                {{ detailTiket?.visit_check_in ? useString.setDateTimeFormat(new Date(detailTiket.visit_check_in)) : 'Baru saja' }}
              </span>
            </div>
            <div class="flex flex-col items-end">
              <span class="text-[10px] font-black text-white/70 uppercase tracking-widest">Check OUT</span>
              <span class="text-sm font-semi-bold text-white mt-1">
                {{ detailTiket?.visit_check_out ? useString.setDateTimeFormat(new Date(detailTiket.visit_check_out)) : '-' }}
              </span>
            </div>
          </div>
        </div>
        <!-- Glass blur stats above info card -->
        <div class="glass rounded-[24px] p-5 border border-white/20 shadow-2xl">
          <div class="grid grid-cols-2 gap-4 items-start">
            <div class="flex flex-col">
              <span class="text-[10px] font-black text-white/70 uppercase tracking-widest">Total Sales Items</span>
              <span class="text-2xl font-black text-white mt-1">{{ detailStatisticStore?.totalItems ?? 0 }}</span>
            </div>
            <div class="flex flex-col items-end">
              <span class="text-[10px] font-black text-white/70 uppercase tracking-widest">Total Sales</span>
              <span class="text-2xl font-black text-java-green mt-1">
                {{ useString?.setNumberFormat(detailStatisticStore?.totalSales ?? 0) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div v-if="!isSubPage" class="flex-1 bg-white rounded-t-[40px] -mt-30 relative z-0 px-5 pt-10 pb-56 space-y-10 shadow-[0_-12px_40px_-15px_rgba(0,0,0,0.1)]">
      <!-- Operations Menu -->
      <div>
        <h2 class="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Operasi Toko</h2>
        <StoreMenu />
      </div>
    </div>
    <!-- Visit Action Section -->
    <div v-if="!isSubPage" class="fixed inset-x-0 bottom-0 z-40 pb-0 safe-area-bottom">
      <VisitInformation 
        :itemTiket="detailTiket" 
        @onCheckin="checkInAction" 
        @inputVisit="goToInputVisit" 
        @onCheckout="checkOut" 
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { BuildingStorefrontIcon, MapPinIcon } from '@heroicons/vue/24/outline'
import { useLoadingState } from '~/stores/loading'
import { useNotificationStore } from '~/stores/notification'
import { useUserStore } from '~/stores/user'
import type { HistoryTransaction, StatisticStore, Tiket, User } from '~/types/user'
import VisitInformation from '~/components/page/store/VisitInformation.vue'
import StoreMenu from '~/components/page/store/StoreMenu.vue'
import { useLocation } from '~/stores/location'

const useStore = useUserStore()
const useNotification = useNotificationStore()
const allTiket = computed((): Tiket[] => useStore.getAllTiketUser()?.sort((a, b) => {
  return new Date(b?.last_updated).getTime() - new Date(a?.last_updated).getTime()
}))

const route = useRoute();
const detailTiket = computed(() => {
  return allTiket.value.find((tiket) => tiket?.customer_no === route?.params?.id) as Tiket
})
const customerId = useRoute()?.params?.id as string
const detailStatisticStore = computed(():StatisticStore | undefined | null => useStore?.getStatisticStore(customerId))

const useLoading = useLoadingState()
const userLocation = useUserLocation()
const useString = useUseString()
const isSubPage = computed(() => {
  const current = route.path || ''
  return current.startsWith(`/visit/store/${customerId}/`)
})

const visitStatusBadgeClass = computed(() => {
  const status = detailTiket.value?.visit_status
  if (status === 'INPROGRESS') {
    return 'bg-success/20 text-success border-success/20'
  }
  if (status === 'FINISH') {
    return 'bg-primary/20 text-primary border-primary/20'
  }
  return 'bg-warning/20 text-warning border-warning/20'
})

const checkInAction = async () => {
  if (detailTiket.value?.visit_status === 'TODO') {
    detailTiket.value.visit_check_in = new Date().toISOString()
    detailTiket.value.visit_status = 'INPROGRESS'
  }

  detailTiket.value.last_updated = new Date().toISOString()    
  if (!userLocation.coords.value) {
    await userLocation.sendPositionToServer()
  }
  detailTiket.value.visit_lat = userLocation.coords.value.lat
  detailTiket.value.visit_lng = userLocation.coords.value.lng
  detailTiket.value.visit_address = userLocation.address.value
  detailTiket.value.visit_date = new Date().toISOString()
  detailTiket.value.visit_distance = Number(distance ?? 0)
  await useStore.updateTicketData(detailTiket.value)
  useStore.addUserActivity({
    id_related: detailTiket.value?.id as string,
    user_id: useStore?.user?.user_id as string,
    category: 'VISIT',
    description: `Checkin visit ${detailTiket.value?.customer_name}`,
    timestamp: new Date().toISOString(),
  })

  useLoading.disLoading()
  useNotification.toggle('Berhasil checkin')
}

const goToInputVisit = () => {
  navigateTo(`/visit/store/${route?.params?.id}/input`)
}

const checkOut = async () => {
  useLoading.setLoading('Mohon tunggu...')
  detailTiket.value.visit_status = 'FINISH'
  detailTiket.value.last_updated = new Date().toISOString()
  detailTiket.value.visit_check_out = new Date().toISOString()
  
  const user = useStore?.user as User
  if (user?.role === 'COLLECTOR' && detailTiket.value.visit_payment) {
    detailTiket.value.balance -= parseInt(detailTiket.value.visit_payment as string)
  
    const invoice: HistoryTransaction = {
      amount: parseInt(detailTiket.value.visit_payment as string),
      customer_id: customerId,
      invoice_no: `INV-${Date.now()}`,
      order_date: (new Date()).toISOString(),
      posting_date: (new Date()).toISOString(),
      type: 'PAYMENT'
    }
    // useStore?.$patch(state => {
    //   state?.history_transaction?.push(invoice)
    // })
    useStore.updateStatistic(user?.user_id, parseInt(detailTiket.value.visit_payment as string))
  }
  
  await useStore.updateTicketData(detailTiket.value)
  useStore.addUserActivity({
    id_related: detailTiket.value?.id as string,
    user_id: useStore?.user?.user_id as string,
    category: 'VISIT',
    description: `Checkout visit ${detailTiket.value?.customer_name}`,
    timestamp: new Date().toISOString(),
  })

  await useUserStore().addToHistory(detailTiket.value)
  useLoading.disLoading()
  useNotification.toggle('Berhasil checkout')
}

const distance = computed(() => {
  const lat = detailTiket.value?.lat
  const lng = detailTiket.value?.lng
  if (typeof lat !== 'number' || typeof lng !== 'number') return '—'
  return userLocation.calculateDistance({ lat, lng }) ?? 0
})
const insideRadius = computed((): boolean => {
  const lat = detailTiket.value?.lat
  const lng = detailTiket.value?.lng
  if (typeof lat !== 'number' || typeof lng !== 'number') return false
  return userLocation.isInsideRadius({ lat, lng }, useStore.tolerance)
})

definePageMeta({ layout: false })
onMounted(() => {
  if (allTiket.value.length === 0) {
    useUserStore().fetchAllTiketUser()
  }
})
</script>

<style scoped>
@reference "../../../../assets/css/main.css";

.page-container {
  @apply min-h-screen bg-white flex flex-col overflow-x-hidden;
}

.cart-btn-white :deep(svg) {
  @apply text-white;
}

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
