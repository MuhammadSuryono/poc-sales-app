<template>
  <div class="w-full flex flex-col bg-gray-200">
    <CardNavbarBack title="Detail Toko">
      <template #right>
        <NavbarCart />
      </template>
    </CardNavbarBack>
    
    <div class="flex flex-row gap-3 mt-5 px-4 items-start py-5">
      <div class="w-[20%] bg-white rounded-full border p-2 items-center flex justify-center">
        <BuildingStorefrontIcon class="h-10 w-10 text-gray-400" />
      </div>
      <div class="flex flex-col">
        <span class="font-semibold text-xl">{{ detailTiket?.customerName }}</span>
        <span class="font-normal text-sm text-gray-600">{{ detailTiket?.customerNo }}</span>
      </div>
    </div>

    <div class="px-3 py-2">
      <div class="bg-white rounded-lg p-4 w-full flex flex-row items-center justify-between">
        <div class="text-sm flex flex-col items-start">
          <span class="text-gray-600">Total Sales Items</span>
          <span class="text-lg font-semibold">{{ detailStatisticStore?.totalItems }}</span>
        </div>
        <div class="text-sm flex flex-col items-end">
          <span class="text-gray-600">Total Sales</span>
          <span class="text-lg font-semibold">{{ useString?.setNumberFormat(detailStatisticStore?.totalSales ?? 0) }}</span>
        </div>
      </div>
    </div>

    <div class="rounded-2xl border-t px-3 py-3 bg-white">
      <PageStoreVisitInformation :itemTiket="detailTiket" @onCheckin="checkInAction" @inputVisit="goToInputVisit" @onCheckout="checkOut" />
      <div class="p-3 w-full mt-5">
        <PageStoreMenu />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { BuildingStorefrontIcon } from '@heroicons/vue/24/outline'
import { useLoadingState } from '~/stores/loading'
import { useNotificationStore } from '~/stores/notification'
import { useUserStore } from '~/stores/user'
import type { HistoryTransaction, StatisticStore, Tiket, User } from '~/types/user'

const useStore = useUserStore()
const useNotification = useNotificationStore()
const allTiket = computed((): Tiket[] => useStore.getAllTiketUser()?.sort((a, b) => {
  return new Date(b?.lastUpdated).getTime() - new Date(a?.lastUpdated).getTime()
}))

const route = useRoute();
const detailTiket = computed(() => {
  return allTiket.value.find((tiket) => tiket?.customerNo === route?.params?.id) as Tiket
})
const customerId = useRoute()?.params?.id as string
const detailStatisticStore = computed(():StatisticStore | undefined | null => useStore?.getStatisticStore(customerId))
// const histories = computed(() => useStore?.historyTransaction?.filter(h => h.customerId === customerId))

const useLoading = useLoadingState()
const userLocation = useUserLocation()
const useString = useUseString()

const checkInAction = () => {
  if (detailTiket.value?.visitStatus === 'TODO') {
    detailTiket.value.visitCheckIn = new Date().toISOString()
    detailTiket.value.visitStatus = 'INPROGRESS'
  }

  const distance = userLocation.calculateDistance({
    lat: detailTiket.value?.lat,
    lng: detailTiket.value?.lng
  })
  
  detailTiket.value.lastUpdated = new Date().toISOString()    
  detailTiket.value.visitLat = userLocation.coords.value.lat
  detailTiket.value.visitLng = userLocation.coords.value.lng
  detailTiket.value.visitAddress = userLocation.address.value
  detailTiket.value.visitDate = new Date().toISOString()
  detailTiket.value.visitDistance = distance
  useLoading.disLoading()
  useNotification.toggle('Berhasil checkin')
}

const goToInputVisit = () => {
  navigateTo(`/visit/store/${route?.params?.id}/input`)
}

const checkOut = async () => {
  useLoading.setLoading('Mohon tunggu...')
  detailTiket.value.visitStatus = 'FINISH'
  detailTiket.value.lastUpdated = new Date().toISOString()
  detailTiket.value.visitCheckOut = new Date().toISOString()
  
  const user = useStore?.user as User
  if (user?.role === 'COLLECTOR' && detailTiket.value.visitPayment) {
    detailTiket.value.balance -= parseInt(detailTiket.value.visitPayment as string)
  
    const invoice: HistoryTransaction = {
      amount: parseInt(detailTiket.value.visitPayment as string),
      customerId: customerId,
      invoiceNo: `INV-${Date.now()}`,
      orderDate: (new Date()).toISOString(),
      postingDate: (new Date()).toISOString(),
      type: 'PAYMENT'
    }
    useStore?.$patch(state => {
      state?.historyTransaction?.push(invoice)
    })
    useStore.updateStatistic(user?.userId, parseInt(detailTiket.value.visitPayment as string))
  }

  useUserStore().addToHistory(detailTiket.value)
  useLoading.disLoading()
  useNotification.toggle('Berhasil checkout')
}

</script>

<style>

</style>