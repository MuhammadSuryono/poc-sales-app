<template>
  <div class="min-h-screen bg-gray-50">
    <NavbarBack title="Detail Toko" />
    <div class="max-w-[480px] sm:max-w-[1100px] mx-auto px-4 sm:px-6 py-5 space-y-5">
      <div class="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-3">
        <div class="space-y-1">
          <div class="text-lg font-bold text-gray-900 leading-tight">
            {{ storeName }}
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Last Update</span>
            <span class="text-xs font-semibold text-gray-700">{{ lastUpdatedText }}</span>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2">
          <a v-if="phoneHref" :href="phoneHref" class="flex flex-col items-center gap-1 rounded-xl border border-gray-100 p-3 active:scale-95 transition bg-gray-50">
            <PhoneIcon class="w-5 h-5 text-emerald-600" />
            <span class="text-[11px] font-bold text-gray-700">Telepon</span>
          </a>
          <a v-if="waHref" :href="waHref" target="_blank" class="flex flex-col items-center gap-1 rounded-xl border border-gray-100 p-3 active:scale-95 transition bg-gray-50">
            <ChatBubbleLeftRightIcon class="w-5 h-5 text-green-600" />
            <span class="text-[11px] font-bold text-gray-700">WhatsApp</span>
          </a>
          <a v-if="mapsHref" :href="mapsHref" target="_blank" class="flex flex-col items-center gap-1 rounded-xl border border-gray-100 p-3 active:scale-95 transition bg-gray-50">
            <MapPinIcon class="w-5 h-5 text-sky-600" />
            <span class="text-[11px] font-bold text-gray-700">Maps</span>
          </a>
        </div>
      </div>

      <div class="bg-white border border-gray-100 rounded-2xl p-2 shadow-sm">
        <div class="flex items-center gap-2 p-2">
          <button
            v-for="t in tabs"
            :key="t.key"
            class="px-3 py-1.5 rounded-xl text-xs font-bold border transition flex-1"
            :class="activeTab === t.key ? 'bg-gray-900 text-white border-gray-900' : 'bg-gray-50 text-gray-700 border-gray-200'"
            @click="activeTab = t.key"
          >
            {{ t.label }}
          </button>
        </div>

        <div class="p-3">
          <div v-if="activeTab === 'info'" class="space-y-3">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="rounded-xl border border-gray-100 p-3">
                <div class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Customer Phone</div>
                <div class="text-sm font-semibold text-gray-900">{{ phone || '-' }}</div>
              </div>
              <div class="rounded-xl border border-gray-100 p-3">
                <div class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</div>
                <div class="text-sm font-semibold text-gray-900">{{ status || '-' }}</div>
              </div>
              <div class="rounded-xl border border-gray-100 p-3 sm:col-span-2">
                <div class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Alamat</div>
                <div class="text-sm font-semibold text-gray-900 break-words">{{ address || '-' }}</div>
                <button class="mt-2 px-3 py-1.5 rounded-lg border border-gray-200 text-[11px] font-bold text-gray-700 active:scale-95" @click="copyAddress">Salin Alamat</button>
              </div>
              <div class="rounded-xl border border-gray-100 p-3">
                <div class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Saldo</div>
                <div class="text-sm font-semibold text-gray-900">Rp {{ formatNumber(balance) }}</div>
              </div>
              <div class="rounded-xl border border-gray-100 p-3">
                <div class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Kredit</div>
                <div class="text-sm font-semibold text-gray-900">Rp {{ formatNumber(balanceCredit) }}</div>
              </div>
              <div class="rounded-xl border border-gray-100 p-3">
                <div class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Last Visit Date</div>
                <div class="text-sm font-semibold text-gray-900">{{ formatDate(visitDate) }}</div>
              </div>
              <div class="rounded-xl border border-gray-100 p-3">
                <div class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Last Visit Time</div>
                <div class="text-sm font-semibold text-gray-900">{{ visitTime || '-' }}</div>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="rounded-xl border border-gray-100 p-3">
                <div class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Last Visit Note</div>
                <div class="text-sm font-semibold text-gray-900">{{ visitNote || '-' }}</div>
              </div>
              <div class="rounded-xl border border-gray-100 p-3">
                <div class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Terakhir Diperbarui</div>
                <div class="text-sm font-semibold text-gray-900">{{ lastUpdatedText }}</div>
              </div>
            </div>
          </div>

          <div v-else-if="activeTab === 'lokasi'" class="space-y-3">
            <div class="rounded-2xl border border-gray-100 p-4">
              <div class="text-xs text-gray-600 mb-2">{{ visitAddress || 'Alamat kunjungan belum tersedia' }}</div>
              <div class="flex flex-wrap gap-2">
                <a v-if="mapsHref" :href="mapsHref" target="_blank" class="px-3 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold active:scale-95 transition">Buka di Maps</a>
                <button class="px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 active:scale-95 transition" @click="copyVisitAddress">Salin Alamat Kunjungan</button>
              </div>
            </div>
          </div>

          <div v-else class="space-y-3">
            <div class="grid grid-cols-1 gap-3">
              <div class="rounded-xl border border-gray-100 p-3">
                <div class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Check In</div>
                <div class="text-sm font-semibold text-gray-900">{{ formatDateTime(visitCheckIn) }}</div>
              </div>
              <div class="rounded-xl border border-gray-100 p-3">
                <div class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Check Out</div>
                <div class="text-sm font-semibold text-gray-900">{{ formatDateTime(visitCheckOut) }}</div>
              </div>
              <div class="rounded-xl border border-gray-100 p-3">
                <div class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Durasi</div>
                <div class="text-sm font-semibold text-gray-900">{{ visitDuration || '-' }}</div>
              </div>
              <div class="rounded-xl border border-gray-100 p-3">
                <div class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Jarak</div>
                <div class="text-sm font-semibold text-gray-900">{{ visitDistance || 0 }} km</div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { useUserStore } from '~/stores/user'
import { useMaps } from '~/composables/useMaps'
import { PhoneIcon, ChatBubbleLeftRightIcon, MapPinIcon } from '@heroicons/vue/24/outline'
import NavbarBack from '~/components/card/NavbarBack.vue'

const route = useRoute()
const useStore = useUserStore()
const maps = useMaps()
const customerId = route.params.id as string
const detailTiket = computed(() => useStore.allTiket.find(t => t?.customer_no === customerId))

const get = (a?: any, b?: any) => a ?? b ?? '-'
const storeName = computed(() => get(detailTiket.value?.customer_name, detailTiket.value?.customer_name))
const visitStatus = computed(() => get(detailTiket.value?.visit_status, detailTiket.value?.visit_status))
const phone = computed(() => get(detailTiket.value?.customer_phone, detailTiket.value?.customer_phone))
const status = computed(() => get(detailTiket.value?.status))
const address = computed(() => get(detailTiket.value?.alamat))
const balance = computed(() => Number(get(detailTiket.value?.balance, 0)))
const balanceCredit = computed(() => Number(get(detailTiket.value?.balance_credit, 0)))
const visitDate = computed(() => get(detailTiket.value?.visit_date))
const visitTime = computed(() => get(detailTiket.value?.visit_time))
const visitNote = computed(() => get(detailTiket.value?.visit_note))
const visitAddress = computed(() => get(detailTiket.value?.visit_address))
const lastUpdated = computed(() => get(detailTiket.value?.last_updated))
const lat = computed(() => detailTiket.value?.lat)
const lng = computed(() => detailTiket.value?.lng)
const visitCheckIn = computed(() => get(detailTiket.value?.visit_check_in))
const visitCheckOut = computed(() => get(detailTiket.value?.visit_check_out))
const visitDuration = computed(() => get(detailTiket.value?.visit_duration))
const visitDistance = computed(() => get(detailTiket.value?.visit_distance))

const tabs = [
  { key: 'info', label: 'Info' },
  { key: 'lokasi', label: 'Lokasi' },
  { key: 'aktivitas', label: 'Aktivitas' }
]
const activeTab = ref<string>('info')

const formatNumber = (n: number) => new Intl.NumberFormat('id-ID').format(n)
const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString('id-ID') : '-'
const formatDateTime = (d?: string) => d ? new Date(d).toLocaleString('id-ID') : '-'
const lastUpdatedText = computed(() => formatDateTime(lastUpdated.value))

const phoneHref = computed(() => phone.value ? `tel:${phone.value}` : '')
const waHref = computed(() => phone.value ? `https://wa.me/${phone.value}` : '')
const mapsHref = computed(() => (lat.value && lng.value) ? maps.getLocationUrl(lat.value, lng.value) : '')

const copyAddress = async () => {
  const addr = address.value || ''
  if (!addr) return
  await navigator.clipboard.writeText(addr)
}
const copyVisitAddress = async () => {
  const addr = visitAddress.value || ''
  if (!addr) return
  await navigator.clipboard.writeText(addr)
}

const visitStatusBadgeClass = computed(() => {
  const s = visitStatus.value
  if (s === 'INPROGRESS') return 'bg-emerald-50 text-emerald-700 border-emerald-100'
  if (s === 'FINISH') return 'bg-sky-50 text-sky-700 border-sky-100'
  return 'bg-yellow-50 text-yellow-700 border-yellow-100'
})
</script>

<style scoped>
</style>