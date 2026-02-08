<template>
  <div class="home-page">
    <!-- Hero Section with Gradient Background -->
    <div class="hero-section bg-gradient-java-hero sm:pt-4">
      <div class="flex flex-row gap-4 items-center px-6 py-8">
        <NuxtImg 
          class="h-16 w-16 rounded-full border-2 border-white/20 shadow-xl hover:cursor-pointer transition-base hover:scale-105" 
          :src="user?.profile" 
        />
        <div class="flex flex-col">
          <span class="font-bold text-2xl text-white tracking-tight">Hello, {{ user?.name }}</span>
          <span class="text-sm text-java-green font-semibold uppercase tracking-widest">{{ user?.role }}</span>
        </div>
      </div>

      <!-- Location Card -->
      <div class="mx-4 mb-4 glass rounded-lg p-3 animate-slide-up">
        <div class="flex flex-row items-start gap-2">
          <MapPinIcon class="h-5 w-5 text-java-green flex-shrink-0 mt-0.5" />
          <div class="flex flex-col gap-1 flex-1">
            <span class="text-sm font-medium text-white">Your Location</span>
            <span class="text-xs text-label-tertiary">{{ myAddress || 'Getting location...' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="content-section bg-white rounded-t-3xl -mt-4 px-4 py-6 min-h-screen">
      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 gap-4 mb-6">
        <div class="stat-card hover-lift">
          <div class="flex items-center gap-3 mb-3">
            <div class="stat-icon bg-gradient-java-accent">
              <BuildingStorefrontIcon class="h-6 w-6 text-white" />
            </div>
            <span class="text-sm font-semibold text-gray-700">Kunjungan Hari Ini</span>
          </div>
          <Javaco />
        </div>
        <!-- Visit Statistics -->
        <div class="stat-card hover-lift">
          <div class="flex items-center gap-3 mb-3">
            <div class="stat-icon bg-gradient-java-accent">
              <BuildingStorefrontIcon class="h-6 w-6 text-white" />
            </div>
            <span class="text-sm font-semibold text-gray-700">Daftar Kunjungan</span>
          </div>
          <HomeStatisticVisit />
        </div>

        <!-- Sales/Collection Statistics -->
        <div class="stat-card hover-lift">
          <div class="flex items-center gap-3 mb-3">
            <div class="stat-icon bg-gradient-java-primary">
              <ChartBarIcon class="h-6 w-6 text-white" />
            </div>
            <span class="text-sm font-semibold text-gray-700" v-if="user?.role === 'SALES'">
              Pengajuan Penjualan Hari Ini
            </span>
            <span class="text-sm font-semibold text-gray-700" v-if="user?.role === 'COLLECTOR'">
              Total Penagihan Hari Ini
            </span>
          </div>
          <HomeStatisticSale />
        </div>
      </div>

      <!-- Menu Grid -->
      <HomeMenu />

      <!-- In Progress Visits -->
      <div v-if="allTiketInProgress?.length > 0" class="mt-6">
        <div class="flex items-center gap-2 mb-3">
          <ArrowsUpDownIcon class="h-5 w-5 text-primary" />
          <span class="text-sm font-semibold text-gray-800">Sedang Dikunjungi</span>
        </div>
        <div class="flex flex-col gap-2">
          <CustomerIncoming 
            v-for="(dt, i) in allTiketInProgress?.slice(0,3)" 
            :tiketData="dt" 
            :key="i" 
            @detail="goToIncomingPageDetail"
            class="animate-slide-up"
          />
        </div>
      </div>

      <!-- Visit List -->
      <div class="mt-6">
        <div class="flex items-center gap-2 mb-3">
          <ListBulletIcon class="h-5 w-5 text-primary" />
          <span class="text-sm font-semibold text-gray-800">Customer List</span>
        </div>
        <div class="flex flex-col gap-2">
          <CustomerIncoming 
            v-for="(dt, i) in allTiketTodo?.slice(0,3)" 
            :tiketData="dt" 
            :key="i" 
            @detail="goToIncomingPageDetail"
            class="animate-slide-up"
          />
        </div>

        <!-- View All Button -->
        <div 
          class="flex items-center justify-center gap-1 mt-4 text-primary cursor-pointer hover:opacity-80 transition-base py-2" 
          @click="navigateTo('/visit/list')"
        >
          <span class="text-sm font-medium">Lihat semua</span>
          <ArrowDownIcon class="h-4 w-4" />
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
import Javaco from '~/components/home/statistic/javaco.vue';
import { useLocation } from '~/stores/location';
import { useUserStore } from '~/stores/user';
import type { Tiket, User } from '~/types/user';

const locationStore = useLocation()
const myAddress = computed(() => locationStore.myAddress)
const { getLocation } = useUserLocation()

const userStore = useUserStore()
const user = computed((): User | null => userStore?.user);
const allTiket = computed((): Tiket[] => userStore?.allTiket || [])
const allTiketTodo = computed((): Tiket[] => allTiket.value.filter(tiket => tiket.visit_status === 'TODO'))
const allTiketInProgress = computed((): Tiket[] => allTiket.value.filter(tiket => tiket.visit_status === 'INPROGRESS'))

const goToIncomingPageDetail = (id: string) => {
  navigateTo(`/visit/store/${id}`)
}

onMounted(async () => {
  userStore.fetchAllTiketUser()
  await getLocation()
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: var(--color-gray-50);
}

.hero-section {
  position: relative;
  padding-bottom: 2rem;
}

.content-section {
  position: relative;
  z-index: 10;
}

.stat-card {
  background: white;
  border-radius: 1rem;
  padding: 1.25rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-gray-100);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
}
</style>