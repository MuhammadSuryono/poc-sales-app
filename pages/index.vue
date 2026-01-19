<template>
  <div class="bg-primary">
    <div class="flex flex-row gap-2 items-center px-3 py-10">
      <NuxtImg class="h-20 w-20 rounded-full text-gray-500 hover:cursor-pointer"
               :src="user?.profile" />

      <div class="flex flex-col gap-1">
        <span class="font-bold text-xl text-white">Hello, {{ user?.name }}</span>
        <span class="text-sm text-white">{{ user?.role }}</span>
      </div>
    </div>
    <div class="w-full flex flex-col sm:flex-row gap-5 py-2 rounded-t-xl px-3 border-t bg-white">
      <div class="flex flex-col gap-2 sm:w-[60%] py-3">
        <div class="flex flex-row items-center gap-1">
          <BuildingStorefrontIcon class="h-5 w-5 text-primary" />
          <span class="text-sm font-normal">Kunjungan Hari Ini</span>
        </div>
        <HomeStatisticVisit />
        <div class="flex flex-row items-center gap-1 mt-2">
          <ChartBarIcon class="h-5 w-5 text-primary" />
          <span class="text-sm font-normal" v-if="user?.role === 'SALES'">Pengajuan Penjualan Hari Ini</span>
          <span class="text-sm font-normal" v-if="user?.role === 'COLLECTOR'">Total Penagihan Hari Ini</span>
        </div>
        <HomeStatisticSale />
      </div>
      
      <div class="flex flex-col gap-1">
        <div class="flex flex-row items-center gap-1">
          <div class="w-[5%]">
            <MapPinIcon class="h-5 w-5 text-danger" />
          </div>
          <span class="text-sm">Your Location</span>
        </div>
        <span class="text-xs font-normal text-gray-400">{{ myAddress }}</span>
      </div>
      <HomeMenu />

      <div class="flex flex-col mt-5 gap-2 py-3">
        <div class="flex flex-row items-center gap-1" v-if="allTiketInProgress?.length > 0">
          <ArrowsUpDownIcon class="h-5 w-5 text-primary" />
          <span class="text-sm font-normal">Sedang Dikunjungi</span>
        </div>
        <CustomerIncoming @detail="goToIncomingPageDetail" v-for="(dt, i) in allTiketInProgress?.slice(0,3)" :tiketData="dt" :key="i" />
        

        <hr class="text-gray-300 my-3"/>
        <div class="flex flex-row items-center gap-1">
          <ListBulletIcon class="h-5 w-5 text-primary" />
          <span class="text-sm font-normal">Daftar Kunjungan</span>
        </div>

        <CustomerIncoming @detail="goToIncomingPageDetail" v-for="(dt, i) in allTiketTodo?.slice(0,3)" :tiketData="dt" :key="i" />

        <div class="flex items-center text-center justify-center mt-3 text-primary" @click="navigateTo('/visit/list')">
          <ArrowDownIcon class="h-3 w-3" />
          <span class="text-sm cursor-pointer">Lihat semua</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { 
  ArrowDownIcon, 
  ArrowsUpDownIcon, 
  BuildingStorefrontIcon, 
  ChartBarIcon, 
  ListBulletIcon, 
  MapPinIcon 
} from '@heroicons/vue/24/outline'
import CustomerIncoming from '~/components/card/CustomerIncoming.vue';
import { useLocation } from '~/stores/location';
import { useUserStore } from '~/stores/user';
import type { Tiket, User } from '~/types/user';

const locationStore = useLocation()
const myAddress = computed(() => locationStore.myAddress)

const userStore = useUserStore()
const user = computed((): User => userStore?.user);
const allTiket = computed((): Tiket[] => userStore.getAllTiketUser())
const allTiketTodo = computed((): Tiket[] => allTiket.value.filter(tiket => tiket.visitStatus === 'TODO'))
const allTiketInProgress = computed((): Tiket[] => allTiket.value.filter(tiket => tiket.visitStatus === 'INPROGRESS'))

const goToIncomingPageDetail = (id: string) => {
  navigateTo(`/visit/store/${id}`)
}

</script>

<style>

</style>