<template>
  <div class="page-viewport no-scrollbar">
    <!-- Premium Header Section -->
    <div class="header-section">
      <!-- Fixed Header Navbar -->
      <div class="header-nav shadow-header">
        <CardNavbarBack title="Daftar Kunjungan"/>

        <!-- Integrated Map with Premium Overlay -->
        <div class="map-container">
          <client-only>
            <Maps :lat="myLocation.lat" :lng="myLocation.lng" class="w-full h-full" />
          </client-only>
          <div class="map-gloss"></div>
        </div>
      </div>

      <!-- Stats Overlay (Floats over Map) -->
      <div class="stats-overlay">
        <div class="stats-card-premium glass-dark bg-white/5 backdrop-blur-xl shadow-2xl animate-slide-up">
          <div class="flex items-center gap-4">
            <div class="stats-icon-box shadow-inner">
              <BuildingStorefrontIcon class="w-6 h-6 text-white" />
            </div>
            <div class="flex-1">
              <div class="flex justify-between items-end mb-2.5">
                <span class="text-[10px] font-bold text-white uppercase tracking-widest leading-none">Target Hari Ini</span>
                <span class="text-white font-black text-xl leading-none">
                  {{ allTiketFinish?.length ?? 0 }}<span class="text-white/40 text-xs font-bold ml-1">/ {{ allTiket?.length ?? 0 }}</span>
                </span>
              </div>
              
              <!-- Custom Premium Progress Bar -->
              <div class="progress-track shadow-inner">
                <div
                  class="progress-fill bg-gradient-to-r from-java-green via-emerald-400 to-teal-300"
                  :style="{ width: `${(allTiketFinish?.length ?? 0) / (allTiket?.length || 1) * 100}%` }"
                ></div>
              </div>

              <!-- Compact Stat Detail -->
              <div class="flex justify-between mt-4">
                <div class="flex flex-col">
                  <span class="label-muted">Pending</span>
                  <span class="text-[11px] font-black text-white">{{ allTiketTodo?.length ?? 0 }} Toko</span>
                </div>
                <div class="flex flex-col items-end">
                  <span class="label-muted text-right text-java-green/80">On Progress</span>
                  <span class="text-[11px] font-black text-java-green">{{ allTiketInProgress?.length ?? 0 }} Toko</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main List Section -->
    <div class="list-section">
      <!-- Filter Navigation -->
      <div class="filter-nav no-scrollbar px-5">
        <button 
          v-for="filter in ['all', 'todo', 'inprogress', 'finish']" 
          :key="filter"
          @click="setActiveFilter(filter)"
          class="filter-tab"
          :class="{ 'active': activeFilter === filter }"
        >
          <span class="tab-text">{{ getFilterLabel(filter) }}</span>
          <span class="tab-count" :class="{ 'count-active': activeFilter === filter }">
            {{ getCount(filter) }}
          </span>
        </button>
      </div>

      <!-- Scrollable List Area -->
      <div class="px-5 space-y-4 pt-4 pb-24">
        <div v-if="dataTiket.length === 0" class="empty-state">
          <div class="empty-circle"></div>
          <p class="empty-msg">Sudah tidak ada tugas kunjungan</p>
        </div>
        
        <card-customer-incoming
          v-for="(item, i) in dataTiket"
          :key="item.customer_no"
          :tiketData="item"
          @detail="navigateTo(`/visit/store/${item.customer_no}`)"
          class="visit-card animate-slide-up"
          :style="{ animationDelay: `${i * 150}ms` }"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ArrowLeftIcon, BuildingStorefrontIcon } from '@heroicons/vue/24/outline'
import { useLocation } from '~/stores/location';
import { useUserStore } from '~/stores/user';
import type { Tiket } from '~/types/user';

const locationStore = useLocation()
const myLocation = computed(() => locationStore.myLocation)
const userStore = useUserStore()

const allTiket = computed((): Tiket[] => userStore.getAllTiketUser())
const allTiketTodo = computed((): Tiket[] => allTiket.value.filter(tiket => tiket.visit_status === 'TODO'))
const allTiketInProgress = computed((): Tiket[] => allTiket.value.filter(tiket => tiket.visit_status === 'INPROGRESS'))
const allTiketFinish = computed((): Tiket[] => allTiket.value.filter(tiket => tiket.visit_status === 'FINISH'))

const activeFilter = ref<string>('all')
const dataTiket = ref<Tiket[]>([])

const setTiket = (): Tiket[] => {
  switch (activeFilter.value) {
    case 'all': return allTiket.value
    case 'todo': return allTiketTodo.value
    case 'inprogress': return allTiketInProgress.value
    case 'finish': return allTiketFinish.value
    default: return allTiket.value
  }
}

const setActiveFilter = (filter: string) => {
  activeFilter.value = filter
  dataTiket.value = setTiket()
}

const getFilterLabel = (filter: string) => {
  const labels: Record<string, string> = { 
    all: 'Semua', 
    todo: 'Todo', 
    inprogress: 'Active', 
    finish: 'Done' 
  }
  return labels[filter]
}

const getCount = (filter: string) => {
  if (filter === 'all') return allTiket.value.length
  if (filter === 'todo') return allTiketTodo.value.length
  if (filter === 'inprogress') return allTiketInProgress.value.length
  if (filter === 'finish') return allTiketFinish.value.length
  return 0
}

definePageMeta({ layout: false })

onMounted(async () => {
  if (allTiket.value.length === 0) {
    await userStore.fetchAllTiketUser()
  }
  dataTiket.value = setTiket()
})
</script>

<style scoped>
@reference "../../assets/css/main.css";

.page-viewport {
  @apply min-h-screen bg-java-dark flex flex-col overflow-x-hidden;
}

.header-section {
  @apply relative h-[340px] flex-shrink-0;
}

.header-nav {
  @apply relative h-[280px] overflow-hidden;
}

.map-container {
  @apply absolute inset-0 z-10 mt-15;
}

.map-gloss {
  @apply absolute inset-0 z-20 bg-gradient-to-t from-java-dark via-java-dark/30 to-transparent;
}

.stats-overlay {
  @apply absolute -bottom-4 left-0 right-0 px-5 z-40;
}

.stats-card-premium {
  @apply p-6 rounded-[32px] border border-white/10 overflow-hidden shadow-2xl;
}

.stats-icon-box {
  @apply p-3.5 bg-white/10 rounded-2xl border border-white/10 shadow-inner;
}

.progress-track {
  @apply h-2.5 bg-white/5 rounded-full overflow-hidden;
}

.progress-fill {
  @apply h-full rounded-full transition-all duration-1000 ease-out;
}

.label-muted {
  @apply text-[9px] font-black text-white/30 uppercase tracking-widest leading-none mb-1;
}

.list-section {
  @apply flex-1 bg-white mt-8 rounded-t-[44px] pt-10 shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.5)];
}

.filter-nav {
  @apply flex gap-3 overflow-x-auto pb-6;
}

.filter-tab {
  @apply flex items-center gap-2.5 px-6 py-3.5 rounded-2xl border transition-all duration-300 active:scale-95 flex-shrink-0 cursor-pointer;
}

.filter-tab.active {
  @apply bg-java-teal text-white border-java-teal shadow-xl shadow-java-teal/30;
}

.filter-tab:not(.active) {
  @apply bg-gray-50 text-gray-400 border-gray-100 font-bold;
}

.tab-text {
  @apply text-[11px] font-black uppercase tracking-widest;
}

.tab-count {
  @apply flex items-center justify-center px-2 py-0.5 rounded-lg text-[10px] font-black min-w-[22px] transition-colors;
}

.count-active {
  @apply bg-white/20 text-white;
}

.tab-count:not(.count-active) {
  @apply bg-gray-200 text-gray-500;
}

.empty-state {
  @apply flex flex-col items-center justify-center py-24 opacity-20 grayscale scale-90;
}

.empty-circle {
  @apply w-24 h-24 rounded-full bg-gradient-to-br from-gray-200 to-gray-50 mb-6 border-4 border-white shadow-inner;
}

.empty-msg {
  @apply text-xs font-black uppercase tracking-[0.2em] text-gray-500;
}

.shadow-header {
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
}

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>