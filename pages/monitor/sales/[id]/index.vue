<template>
  <div class="min-h-screen bg-gray-50">
    <CardNavbarBack title="Detail Sales"/>
    <div class="w-full mx-auto px-6 py-6 space-y-6">
      <div class="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <NuxtImg
          v-if="user?.profile"
          :src="user?.profile"
          class="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border"
          alt="Profile"
        />
        <div class="flex-1 w-full">
          <p class="text-base sm:text-lg font-bold text-gray-900 leading-tight">{{ user?.name }}</p>
          <div class="flex flex-wrap items-center gap-2 mt-1">
            <span class="text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Last Update</span>
            <span class="text-sm sm:text-base font-semibold text-gray-700">{{ lastUpdateText }}</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-10 gap-4 lg:gap-6">
        <!-- Left 70%: Map -->
        <div class="lg:col-span-7">
          <div class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div id="route-map" class="h-[55vh] lg:h-[calc(100vh-18rem)] w-full"></div>
            <div v-if="points.length === 0" class="p-6">
              <p class="text-sm text-gray-600">Tidak ada rute kunjungan hari ini.</p>
            </div>
          </div>
        </div>

        <!-- Right 30%: Activity (stacks below on mobile) -->
        <div class="lg:col-span-3">
          <div class="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 mb-2">
            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">total Reimbursement Hari Ini</h3>
            <div ref="activityEl" class="space-y-3 max-h-[40vh] lg:max-h-[calc(100vh-18rem)] overflow-auto pr-2">
              <div
                class="flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer"
                @click="openReimbursementModal"
              >
                <div class="flex-1 min-w-0">
                  <strong>{{ setNumberFormat(grandTotalReimbursement) }}</strong>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">Aktivitas Hari Ini</h3>

            <div ref="activityEl" class="space-y-3 max-h-[40vh] lg:max-h-[calc(100vh-18rem)] overflow-auto pr-2">
              <div
                v-for="(a, i) in shownActivities"
                :key="i"
                class="flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer"
                @click="() => openModal(a)"
              >
                <div class="w-10 h-10 rounded-xl bg-java-teal/10 flex items-center justify-center">
                  <span class="text-xs font-bold text-java-teal">#{{ i + 1 }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-800 truncate">{{ a.description || 'Lokasi kunjungan' }}</p>
                  <span class="text-[11px] text-gray-500">{{ a.timestamp }}</span>
                </div>
              </div>

              <!-- Loading kecil saat autoload -->
              <div v-if="isLoadingMore" class="flex items-center justify-center py-2">
                <span class="inline-block w-4 h-4 border-2 border-java-teal border-t-transparent rounded-full animate-spin"></span>
              </div>

              <!-- Sentinel untuk IntersectionObserver -->
              <div ref="sentinel" class="h-6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <PopUpModal v-model:show="showModalReimbursements" header="Daftar Reimbursement Hari Ini">
      <div class="flex flex-col gap-3">
        <div v-if="reimbursementsList.length === 0" class="text-sm text-gray-500">Belum ada reimbursement.</div>
        <div v-else class="space-y-2">
          <div
            v-for="(r, i) in reimbursementsList"
            :key="i"
            class="rounded-xl border border-gray-100 p-3 bg-white shadow-sm"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex-1 min-w-0">
                <div class="text-sm font-semibold text-gray-900">
                  {{ r.category }} • Rp {{ formatNumber(r.amount || r.total || 0) }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ r.date }} • {{ r.note || 'Tanpa catatan' }}
                </div>
              </div>
              <span class="px-2.5 py-1 rounded-lg text-[11px] font-bold"
                    :class="r.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : r.status === 'REJECTED' ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-yellow-50 text-yellow-700 border border-yellow-100'">
                {{ r.status || 'WAITING' }}
              </span>
            </div>
            <div class="mt-2 text-[11px] text-gray-400" v-if="r.customer_name">
              {{ r.customer_name }}
            </div>
            <div class="mt-2 text-[11px] text-gray-400">
              {{ r.type || '-' }} • {{ r.created_at }}
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex gap-3 w-full p-2">
          <ButtonSecondary
            @click="showModalReimbursements = false"
            text="Tutup"
            class="flex-1"
          />
        </div>
      </template>
    </PopUpModal>
    <PopUpModal v-model:show="showModalVisit" header="Informasi Kunjungan">
      <div class="flex flex-col gap-3">
        <div v-if="!visitInformation?.visit" class="text-sm text-gray-500">Memuat informasi kunjungan...</div>
        <div v-else class="space-y-3">
          <div class="rounded-2xl border border-gray-100 p-3 bg-white shadow-sm">
            <div class="text-sm font-bold text-gray-900">
              {{ visitInformation?.visit?.customer_name }} • {{ visitInformation?.visit?.customer_no }}
            </div>
            <div class="text-[11px] text-gray-500 mt-1">
              {{ visitInformation?.visit?.alamat || '-' }}
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="rounded-xl border border-gray-100 p-3">
              <div class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Check In</div>
              <div class="text-sm font-semibold text-gray-900">{{ formatDateTime(visitInformation?.visit?.visit_check_in) }}</div>
            </div>
            <div class="rounded-xl border border-gray-100 p-3">
              <div class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Check Out</div>
              <div class="text-sm font-semibold text-gray-900">{{ formatDateTime(visitInformation?.visit?.visit_check_out) }}</div>
            </div>
            <div class="rounded-xl border border-gray-100 p-3">
              <div class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Durasi</div>
              <div class="text-sm font-semibold text-gray-900">{{ visitInformation?.visit?.visit_duration || '-' }}</div>
            </div>
            <div class="rounded-xl border border-gray-100 p-3 sm:col-span-2">
              <div class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Alamat Kunjungan</div>
              <div class="text-sm font-semibold text-gray-900 break-words">{{ visitInformation?.visit?.visit_address || '-' }}</div>
            </div>
            <div class="rounded-xl border border-gray-100 p-3 sm:col-span-2">
              <div class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Catatan Kunjungan</div>
              <div class="text-sm font-semibold text-gray-900 break-words">{{ visitInformation?.visit?.visit_note || '-' }}</div>
            </div>
            <div class="rounded-xl border border-gray-100 p-3">
              <div class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Pembayaran</div>
              <div class="text-sm font-semibold text-gray-900">Rp {{ formatNumber(Number(visitInformation?.visit?.visit_payment || 0)) }}</div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Reimbursement Kunjungan</div>
            <div v-if="(visitInformation?.reimbursements?.length || 0) === 0" class="text-sm text-gray-500">Belum ada reimbursement untuk kunjungan ini.</div>
            <div v-else class="space-y-2">
              <div
                v-for="(r, i) in visitInformation?.reimbursements || []"
                :key="i"
                class="rounded-xl border border-gray-100 p-3 bg-white shadow-sm"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-semibold text-gray-900">
                      {{ r.category }} • Rp {{ formatNumber(r.amount || 0) }}
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ r.date }} • {{ r.note || 'Tanpa catatan' }}
                    </div>
                  </div>
                  <span class="px-2.5 py-1 rounded-lg text-[11px] font-bold"
                        :class="r.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : r.status === 'REJECTED' ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-yellow-50 text-yellow-700 border border-yellow-100'">
                    {{ r.status || 'WAITING' }}
                  </span>
                </div>
                <div class="mt-2 text-[11px] text-gray-400" v-if="r.customer_no">
                  Customer: {{ r.customer_no }}
                </div>
              </div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <div class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Foto Kunjungan</div>
              <span class="text-[10px] font-bold text-gray-500">{{ visitInformation?.visitiImages?.length || 0 }} foto</span>
            </div>
            <div v-if="(visitInformation?.visitiImages?.length || 0) === 0" class="text-sm text-gray-500">Belum ada foto kunjungan.</div>
            <div v-else class="grid grid-cols-3 sm:grid-cols-4 gap-2">
              <div
                v-for="img in visitInformation?.visitiImages || []"
                :key="img.id"
                class="relative aspect-square rounded-xl overflow-hidden border border-gray-100 bg-gray-50"
              >
                <NuxtImg :src="img.url" class="w-full h-full object-cover" />
                <span class="absolute bottom-1 left-1 px-2 py-0.5 rounded-lg bg-white/80 text-[10px] font-bold text-gray-700 border border-gray-200">
                  {{ img.category }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex gap-3 w-full p-2">
          <ButtonSecondary
            @click="showModalVisit = false"
            text="Tutup"
            class="flex-1"
          />
        </div>
      </template>
    </PopUpModal>
    <PopUpModal v-model:show="showModalActivityReimbursement" header="Detail Reimbursement">
      <div class="flex flex-col gap-3">
        <div v-if="!currentReimbursement" class="text-sm text-gray-500">Memuat detail reimbursement...</div>
        <div v-else class="space-y-3">
          <div class="rounded-2xl border border-gray-100 p-3 bg-white shadow-sm">
            <div class="flex items-start justify-between gap-3">
              <div class="flex-1 min-w-0">
                <div class="text-sm font-semibold text-gray-900">
                  {{ currentReimbursement.category }} • Rp {{ formatNumber(currentReimbursement.amount || currentReimbursement.total || 0) }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ currentReimbursement.date }} • {{ currentReimbursement.note || 'Tanpa catatan' }}
                </div>
              </div>
              <span class="px-2.5 py-1 rounded-lg text-[11px] font-bold"
                    :class="currentReimbursement.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : currentReimbursement.status === 'REJECTED' ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-yellow-50 text-yellow-700 border border-yellow-100'">
                {{ currentReimbursement.status || 'WAITING' }}
              </span>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="rounded-xl border border-gray-100 p-3">
              <div class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Tipe</div>
              <div class="text-sm font-semibold text-gray-900">{{ currentReimbursement.type || '-' }}</div>
            </div>
            <div class="rounded-xl border border-gray-100 p-3">
              <div class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">User</div>
              <div class="text-sm font-semibold text-gray-900">{{ currentReimbursement.user_id || '-' }}</div>
            </div>
            <div class="rounded-xl border border-gray-100 p-3 sm:col-span-2" v-if="currentReimbursement.customer_name">
              <div class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Toko</div>
              <div class="text-sm font-semibold text-gray-900">{{ currentReimbursement.customer_name }}</div>
            </div>
            <div class="rounded-xl border border-gray-100 p-3">
              <div class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Tanggal</div>
              <div class="text-sm font-semibold text-gray-900">{{ formatDateTime(currentReimbursement.date) }}</div>
            </div>
            <div class="rounded-xl border border-gray-100 p-3">
              <div class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Dibuat</div>
              <div class="text-sm font-semibold text-gray-900">{{ formatDateTime(currentReimbursement.created_at) }}</div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex gap-3 w-full p-2">
          <ButtonSecondary
            @click="showModalActivityReimbursement = false"
            text="Tutup"
            class="flex-1"
          />
        </div>
      </template>
    </PopUpModal>
    <PopUpModal v-model:show="showModalActivityOrder" header="Detail Order">
      <div class="flex flex-col gap-3">
        <div v-if="!currentOrder" class="text-sm text-gray-500">Memuat detail order...</div>
        <div v-else class="space-y-3">
          <div class="rounded-2xl border border-gray-100 p-3 bg-white shadow-sm">
            <div class="flex items-start justify-between gap-3">
              <div class="flex-1 min-w-0">
                <div class="text-sm font-semibold text-gray-900">Order ID • {{ currentOrder.order_id }}</div>
                <div class="text-xs text-gray-500">{{ formatDateTime(currentOrder.created_at) }}</div>
              </div>
              <span class="px-2.5 py-1 rounded-lg text-[11px] font-bold"
                    :class="currentOrder.status === 'WAITING' ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' : currentOrder.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-sky-50 text-sky-700 border border-sky-100'">
                {{ currentOrder.status }}
              </span>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="rounded-xl border border-gray-100 p-3">
              <div class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Customer</div>
              <div class="text-sm font-semibold text-gray-900">{{ currentOrder.customer_no }}</div>
            </div>
            <div class="rounded-xl border border-gray-100 p-3">
              <div class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Jumlah</div>
              <div class="text-sm font-semibold text-gray-900">{{ currentOrder.total_quantity }}</div>
            </div>
            <div class="rounded-xl border border-gray-100 p-3">
              <div class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Total</div>
              <div class="text-sm font-semibold text-gray-900">Rp {{ formatNumber(Number(currentOrder.total_price || 0)) }}</div>
            </div>
            <div class="rounded-xl border border-gray-100 p-3">
              <div class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Metode</div>
              <div class="text-sm font-semibold text-gray-900">{{ currentOrder.payment_method }}</div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Produk</div>
            <div v-if="(currentOrderProducts.length || 0) === 0" class="text-sm text-gray-500">Tidak ada produk.</div>
            <div v-else class="flex items-start gap-2 overflow-x-auto pb-2">
              <div
                v-for="(p, idx) in currentOrderProducts"
                :key="idx"
                class="flex items-center gap-3 rounded-xl border border-gray-100 px-2 py-2 bg-white shadow-sm min-w-[220px]"
              >
                <div class="w-14 h-14 rounded-lg border bg-gray-50 flex items-center justify-center text-[11px] font-bold text-gray-500">{{ p.product_code }}</div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-semibold text-gray-900 truncate">{{ p.products?.name }}</div>
                  <div class="text-[11px] text-gray-500">{{ p.quantity }}x • Rp {{ formatNumber(p.unit_price * (1 - (p.discount || 0) / 100)) }}</div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="currentOrder.note" class="rounded-xl border border-gray-100 p-3">
            <div class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Catatan</div>
            <div class="text-sm font-semibold text-gray-900">{{ currentOrder.note }}</div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex gap-3 w-full p-2">
          <ButtonSecondary
            @click="showModalActivityOrder = false"
            text="Tutup"
            class="flex-1"
          />
        </div>
      </template>
    </PopUpModal>
  </div>
</template>

<script lang="ts" setup>
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png?url'
import markerIcon from 'leaflet/dist/images/marker-icon.png?url'
import markerShadow from 'leaflet/dist/images/marker-shadow.png?url'
import { useRoute, onBeforeRouteLeave } from 'vue-router'
import { watch } from 'vue'
import { useUserStore } from '~/stores/user'
import type { VisitHistory, User, PositionHistory, Reimbursement, VReimbursementSummary, UserActivity, Tiket, VisitImage, ReimbursementStore } from '~/types/user'
import { useMonitoringStore } from '~/stores/monitoring'
import { useOrderStore } from '~/stores/order'

const route = useRoute()
const { dateToday } = useDate()
const id = route.params.id as string
const userStore = useUserStore()
const monitoringStore = useMonitoringStore()
const orderStore = useOrderStore()
const { setNumberFormat } = useNumber()
const user = computed<User | null>(() => userStore.detailUser)

const histories = computed<PositionHistory[]>(() => monitoringStore.userPositionHistory)
const byDay = (d: string | undefined) => d ? new Date(d).toISOString().slice(0, 10) : ''
const todayKey =  dateToday.value;
const todayEntries = computed(() => histories.value.filter(h => byDay(h.created_at) === todayKey))

const reimbursements = computed<VReimbursementSummary | null>(() => monitoringStore.vReimbursementsSummary)
const grandTotalReimbursement = computed(() => reimbursements.value?.total_amount || 0)

const latestDayKey = computed(() => {
  const keys = histories.value.map(h => byDay(h.timestamp)).filter(Boolean)
  return keys.sort().at(-1) || ''
})
const workingEntries = computed(() => {
  const list = todayEntries.value.length > 0 ? todayEntries.value : histories.value.filter(h => byDay(h.created_at) === latestDayKey.value)
  return list.slice().sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime())
})

const points = computed<[number, number][]>(() =>
  workingEntries.value
    .map(h => [h.lat, h.lng] as [number, number])
    .filter(([lat, lng]) => Number.isFinite(lat) && Number.isFinite(lng))
)

const lastUpdateText = computed(() => {
  const times = histories.value
    .map(h => h.created_at)
    .filter(Boolean)
    .map(t => new Date(t as string).getTime())
  const max = times.length ? Math.max(...times) : 0
  if (!max) return '-'
  const d = new Date(max)
  return d.toLocaleString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
})

const activityEl = ref<HTMLElement | null>(null)
const sentinel = ref<HTMLElement | null>(null)
const listCount = ref<number>(10)
const isLoadingMore = ref<boolean>(false)
const userActivities = computed(() => monitoringStore.userActivities || [])
const shownActivities = computed(() => monitoringStore.userActivities || [])
const mapRef = ref<L.Map | null>(null)
const markerLayer = ref<L.LayerGroup | null>(null)
const routeLine = ref<L.Polyline | null>(null)
const showModalReimbursements = ref<boolean>(false)
const showModalVisit = ref<boolean>(false)
const showModalActivityReimbursement = ref<boolean>(false)
const showModalActivityOrder = ref<boolean>(false)
const visitInformation = ref<{ visit: Tiket, visitiImages: VisitImage[], reimbursements: ReimbursementStore[] }>()
const reimbursementInformation = ref<any>({})
const orderInformation = ref<{ order: any, products: any[] } | null>(null)
const reimbursementsList = computed(() => monitoringStore.reimbursementsToday || [])

const loadMore = () => {
  if (listCount.value < userActivities.value.length) {
    isLoadingMore.value = true
    listCount.value = Math.min(listCount.value + 10, userActivities.value.length)
    setTimeout(() => { isLoadingMore.value = false }, 300)
  }
}

const openModal = async (dt: UserActivity) => {
  if (dt.category === 'VISIT') {
    showModalVisit.value = true
    const data = await monitoringStore.fetchInformationVisit(dt.id_related)
    visitInformation.value = data
    return
  }

  if (dt.category === 'REIMBURSEMENT') {
    showModalActivityReimbursement.value = true
    const data = await monitoringStore.fetchInformationReimbursement(dt.id_related)
    reimbursementInformation.value = data
    return
  }

  if (dt.category === 'ORDER') {
    showModalActivityOrder.value = true
    const data = await orderStore.fethOrderInformation(dt.id_related) as { order: any, products: any[] }
    orderInformation.value = data
    return
  }
}

let io: IntersectionObserver | null = null
let poller: number | undefined
io = new IntersectionObserver((entries) => {
  if (entries[0]?.isIntersecting) loadMore()
}, { root: activityEl.value, threshold: 1.0 })

if (sentinel.value) io.observe(sentinel.value)

const fetchDataInterval = async () => {
  await monitoringStore.fetchUserPositionHistoryToday(id)
  await monitoringStore.fetchVReimbursementsSummary(id)
  await monitoringStore.fetchUserActivities(id)
  await monitoringStore.fetchReimbursements(id)
}

onBeforeUnmount(() => {
  io?.disconnect()
  if (poller) clearInterval(poller)
  mapRef.value?.remove()
  monitoringStore.clearDataMonitoring()
})
onBeforeRouteLeave(() => {
  if (poller) {
    clearInterval(poller)
    poller = undefined
  }
})

onMounted(async () => {
  await userStore.fetchDetailUser(id)
  await fetchDataInterval()
  // poller = window.setInterval(async () => {
  //   await fetchDataInterval()
  // }, 10000)
  const icon = L.icon({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(L.Marker as any).prototype.options.icon = icon
  console.log(points.value, histories.value)

  const centerLat = points.value[0]?.[0] ?? -6.268259
  const centerLng = points.value[0]?.[1] ?? 106.805113
  mapRef.value = L.map('route-map').setView([centerLat, centerLng], 13)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(mapRef.value)
  markerLayer.value = L.layerGroup().addTo(mapRef.value)

  const updateMap = () => {
    const m = mapRef.value
    if (!m || !markerLayer.value) return
    markerLayer.value.clearLayers()
    points.value.forEach((p, idx) => {
      const mk = L.marker(p)
      mk.addTo(markerLayer.value as L.LayerGroup)
      mk.bindPopup(`<div class="text-sm text-gray-600"><strong>${workingEntries.value[idx].locationName}</strong><br>${workingEntries.value[idx].timestamp}</div>`)
    })
    if (routeLine.value) {
      routeLine.value.remove()
      routeLine.value = null
    }
    if (points.value.length >= 2) {
      routeLine.value = L.polyline(points.value, { color: '#0f766e', weight: 4 }).addTo(m)
      m.fitBounds(routeLine.value.getBounds(), { padding: [30, 30] })
    } else if (points.value.length === 1) {
      m.setView(points.value[0], m.getZoom())
    }
  }
  updateMap()
  watch(points, () => updateMap())
})

const formatNumber = (n: number) => new Intl.NumberFormat('id-ID').format(n)
const formatDateTime = (d?: string) => d ? new Date(d).toLocaleString('id-ID') : '-'
const currentReimbursement = computed(() => {
  const r = reimbursementInformation.value?.reimbursements
  if (!r) return null
  if (Array.isArray(r)) return r[0] || null
  return r
})
const currentOrder = computed(() => orderInformation.value?.order || null)
const currentOrderProducts = computed(() => orderInformation.value?.products || [])
const openReimbursementModal = async () => {
  showModalReimbursements.value = true
  if (reimbursementsList.value.length === 0) {
    await monitoringStore.fetchReimbursementsGeneralToday(id)
  }
}

</script>

<style scoped>
</style>
