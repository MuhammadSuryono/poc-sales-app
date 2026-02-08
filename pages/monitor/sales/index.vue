<template>
  <div class="min-h-screen bg-gray-50">
    <div class="w-full mx-auto px-6 py-6">
      <div class="grid grid-cols-5 gap-6">
        <!-- Left: 80% -->
        <div class="col-span-5 lg:col-span-4 space-y-4">
          <!-- Running Clock -->
          <div class="flex items-center justify-between bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-java-teal/10 border border-java-teal/20 flex items-center justify-center">
                <ClockIcon class="h-6 w-6 text-java-teal" />
              </div>
              <div class="flex flex-col">
                <span class="text-xs font-black text-gray-500 uppercase tracking-widest">Tanggal</span>
                <span class="text-sm font-bold text-gray-800">{{ dateText }}</span>
              </div>
            </div>
            <div class="text-3xl font-black text-gray-900 tracking-widest">
              {{ timeText }}
            </div>
          </div>

          <!-- Big Map -->
          <div class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div id="sales-map" class="h-[calc(100vh-18rem)] w-full"></div>
          </div>
        </div>

        <!-- Right: 20% -->
        <div class="col-span-5 lg:col-span-1">
          <div class="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">Daftar Sales</h3>
            <div class="space-y-3">
              <NuxtLink
                v-for="u in sales"
                :key="u.user_id"
                :to="`/monitor/sales/${u.user_id}`"
                class="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:shadow-md transition"
              >
                <NuxtImg :src="u.profile" class="w-10 h-10 rounded-full object-cover border" alt="Profile" />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-bold text-gray-800 truncate">{{ u.name }}</p>
                  <span
                    class="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-widest px-2 py-0.5 rounded"
                    :class="hasVisit(u.user_id) ? 'bg-java-green/10 text-java-green border border-java-green/20' : 'bg-gray-100 text-gray-500 border border-gray-200'"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="hasVisit(u.user_id) ? 'bg-java-green' : 'bg-gray-400'"></span>
                    {{ hasVisit(u.user_id) ? 'Sedang ada kunjungan' : 'Offline' }}
                  </span>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png?url'
import markerIcon from 'leaflet/dist/images/marker-icon.png?url'
import markerShadow from 'leaflet/dist/images/marker-shadow.png?url'
import { ClockIcon } from '@heroicons/vue/24/outline'
import { watch } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useUserStore } from '~/stores/user'
import type { Tiket, User, UserPositionHistory } from '~/types/user'
import { useMonitoringStore } from '~/stores/monitoring'

const userStore = useUserStore()
const monitoringStore = useMonitoringStore()
const sales = computed((): UserPositionHistory[] => monitoringStore.userMonitoring || [])
const tickets = computed((): Tiket[] => userStore.allTiket || [])

const now = ref<Date>(new Date())
const dateText = computed(() => {
  const d = now.value
  return d.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
})
const timeText = computed(() => {
  const d = now.value
  const hh = d.getHours().toString().padStart(2, '0')
  const mm = d.getMinutes().toString().padStart(2, '0')
  const ss = d.getSeconds().toString().padStart(2, '0')
  return `${hh}:${mm}:${ss}`
})

const hasVisit = (userId: string) => tickets.value.some(t => t.user_id === userId && t.visit_status === 'INPROGRESS')

onMounted(async () => {
  await monitoringStore.fetchUserMonitoring()

  const timer = setInterval(() => {
    now.value = new Date()
  }, 1000)

  const defaultIcon = L.icon({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
  })
  // Set default marker icon globally to avoid duplicated imagePath prefixing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(L.Marker as any).prototype.options.icon = defaultIcon

  const centerLat = sales.value[0]?.current_position_lat ?? -6.268259
  const centerLng = sales.value[0]?.current_position_lng ?? 106.805113
  const map = L.map('sales-map').setView([centerLat, centerLng], 12)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map)

  const markerLayer = L.layerGroup().addTo(map)
  const updateMarkers = () => {
    markerLayer.clearLayers()
    sales.value.forEach(u => {
      if (u.current_position_lat && u.current_position_lng) {
        const icon = L.divIcon({
          className: 'user-marker',
          html: `<div style="width:40px;height:40px;border-radius:50%;overflow:hidden;border:2px solid #0f766e;box-shadow:0 2px 8px rgba(0,0,0,0.15)"><img src="${u.profile}" alt="${u.name}" style="width:100%;height:100%;object-fit:cover"/></div>`,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40],
        })
        const marker = L.marker([u.current_position_lat, u.current_position_lng], { icon })
        marker.bindPopup(`<strong>${u.name}</strong><br><span style="font-size:12px;color:#555">ID: ${u.user_id}</span>`)
        marker.addTo(markerLayer)
      }
    })
  }
  updateMarkers()
  watch(sales, () => updateMarkers())

  // let poller: number | undefined = window.setInterval(async () => {
  //   await monitoringStore.fetchUserMonitoring()
  //   updateMarkers()
  // }, 10000)

  onBeforeUnmount(() => {
    clearInterval(timer)
    // clearInterval(poller)
  })
  onBeforeRouteLeave(() => {
    // if (poller) {
    //   clearInterval(poller)
    //   poller = undefined
    // }
  })
})
</script>

<style scoped>
</style>
