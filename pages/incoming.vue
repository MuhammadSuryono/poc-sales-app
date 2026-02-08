<template>
  <div class="incoming-page">
    <!-- Master-Detail Layout -->
    <div class="layout-container">
      <!-- Customer List (Master) -->
      <div 
        class="customer-list-panel"
        :class="{ 'hidden lg:block': showDetail, 'block': !showDetail }"
      >
        <!-- Search Bar -->
        <div class="search-container">
          <FormInput 
            v-model="search" 
            placeholder="Cari customer..." 
            class="w-full"
          >
            <template #icon>
              <MagnifyingGlassIcon class="h-4 w-4 text-gray-400" />
            </template>
          </FormInput>
        </div>

        <!-- Customer Cards -->
        <div class="customer-list scrollbar-hide">
          <CustomerIncoming 
            v-for="(dt, i) in allTiket" 
            :tiketData="dt" 
            :key="i" 
            @detail="goToIncomingPageDetail"
            class="animate-slide-up"
          />
        </div>
      </div>

      <!-- Detail Panel -->
      <div 
        class="detail-panel"
        :class="{ 'block': showDetail, 'hidden lg:block': !showDetail }"
      >
        <!-- Empty State -->
        <div v-if="!showDetail" class="empty-state">
          <div class="empty-icon">
            <UserGroupIcon class="h-16 w-16 text-gray-300" />
          </div>
          <span class="text-lg font-semibold text-gray-400">Pilih customer untuk melihat detail</span>
        </div>

        <!-- Customer Detail -->
        <div v-else class="detail-content animate-fade-in">
          <!-- Header -->
          <div class="detail-header bg-gradient-java-hero">
            <button 
              @click="showDetail = false" 
              class="lg:hidden back-button"
            >
              <ChevronLeftIcon class="h-6 w-6 text-white" />
            </button>
            <div class="flex-1">
              <h2 class="text-xl font-bold text-white">{{ detailTiket?.customerName }}</h2>
              <p class="text-sm text-label-secondary tracking-wide uppercase">{{ detailTiket?.customerNo }}</p>
            </div>
            <div 
              class="status-badge"
              :class="{
                'bg-red-500': detailTiket?.status === 'MACET',
                'bg-success': detailTiket?.status === 'LANCAR'
              }"
            >
              {{ detailTiket?.status }}
            </div>
          </div>

          <!-- Scrollable Content -->
          <div class="detail-scroll-area scrollbar-hide">
            <!-- Customer Info Card -->
            <div class="info-card glass-light shadow-sm">
              <div class="card-header border-b border-gray-100 mb-4 pb-2 flex items-center gap-2">
                <UserIcon class="h-5 w-5 text-primary" />
                <h3 class="font-bold text-gray-800">Informasi Pelanggan</h3>
              </div>
              
              <div class="info-grid overflow-auto scrollbar-hide">
                <div class="info-item">
                  <span class="info-label">Customer No.</span>
                  <span class="info-value font-medium">{{ detailTiket?.customerNo }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">No. KTP/NPWP</span>
                  <span class="info-value">{{ detailTiket?.identityNumber ?? '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Nama</span>
                  <span class="info-value">{{ detailTiket?.customerName ?? '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Telepon</span>
                  <span class="info-value">{{ detailTiket?.customerPhone ?? '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Badan Usaha</span>
                  <span class="info-value">{{ detailTiket?.badanUsaha ?? '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Balance</span>
                  <span class="info-value text-primary font-bold">
                    Rp. {{ numberFormatting.setNumberFormatWithSeparator(detailTiket?.balance) }}
                  </span>
                </div>
                <div class="info-item col-span-2">
                  <span class="info-label">Alamat 1</span>
                  <span class="info-value">{{ detailTiket?.alamat ?? '-' }}</span>
                </div>
                <div class="info-item col-span-2">
                  <span class="info-label">Alamat 2</span>
                  <span class="info-value">{{ detailTiket?.alamat2 ?? '-' }}</span>
                </div>
              </div>
            </div>

            <!-- Activity Tabs -->
            <div class="activity-section">
              <!-- Tab Buttons -->
              <div class="tab-buttons bg-gray-100 p-1 rounded-xl flex gap-1 w-fit mb-4">
                <button 
                  class="tab-button"
                  :class="{ 'tab-active': tabActive === 'visit' }"
                  @click="setTabActive('visit')"
                >
                  <ClockIcon class="h-4 w-4" />
                  <span>Kunjungan</span>
                </button>
                <button 
                  class="tab-button"
                  :class="{ 'tab-active': tabActive === 'history' }"
                  @click="setTabActive('history')"
                >
                  <CurrencyDollarIcon class="h-4 w-4" />
                  <span>Balance</span>
                </button>
              </div>

              <!-- Visit History Tab -->
              <div v-if="tabActive === 'visit'" class="tab-content flex flex-col gap-3">
                <div 
                  v-for="(v, i) in historyVisit" 
                  :key="i"
                  class="visit-card glass-light hover:border-primary transition-base cursor-pointer p-4 border rounded-xl"
                  @click="setVisitHistorySelected(v)"
                >
                  <div class="visit-header flex justify-between items-center mb-2">
                    <span class="visit-id text-[10px] text-gray-400 uppercase tracking-tighter">#VISIT{{ i + 1 }}</span>
                    <span class="visit-date text-xs font-semibold text-java-green">{{ useString.setDateTimeFormat(new Date(v.visitDate || '')) }}</span>
                  </div>
                  <div class="visit-user font-bold text-gray-800 text-sm mb-1">{{ v.userVisitName }}</div>
                  <div class="visit-note text-xs text-gray-500 line-clamp-2 italic">" {{ v.visitNote }} "</div>
                </div>
                <div v-if="historyVisit.length === 0" class="text-center py-10 text-gray-400 italic">
                  Belum ada riwayat kunjungan
                </div>
              </div>

              <!-- Balance History Tab -->
              <div v-if="tabActive === 'history'" class="tab-content">
                <div class="balance-table-container overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                  <table class="w-full text-left text-xs font-mono">
                    <thead class="bg-gray-50 text-gray-600">
                      <tr>
                        <th class="p-3">#Invoice</th>
                        <th class="p-3">Tanggal</th>
                        <th class="p-3">Jenis</th>
                        <th class="p-3 text-right">Debit</th>
                        <th class="p-3 text-right">Kredit</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                      <tr v-for="(h, i) in historyTransaction" :key="i" class="hover:bg-gray-50">
                        <td class="p-3 font-semibold">{{ h.invoiceNo }}</td>
                        <td class="p-3">{{ useString.setDateFormat(new Date(h.date || '')) }}</td>
                        <td class="p-3 uppercase text-[10px]">{{ h.type }}</td>
                        <td class="p-3 text-right text-success">{{ h.debit || 0 }}</td>
                        <td class="p-3 text-right text-red-500">{{ h.credit || 0 }}</td>
                      </tr>
                    </tbody>
                    <tfoot class="bg-gray-50 font-bold border-t-2 border-gray-200">
                      <tr>
                        <td colspan="4" class="p-3 text-right">Grand Total:</td>
                        <td class="p-3 text-right">Rp. 10.000</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Footer -->
          <div 
            v-if="detailTiket?.visitStatus !== 'FINISH'" 
            class="action-footer bg-white border-t border-gray-100 p-4 shadow-[0_-4px_15px_-3px_rgba(0,0,0,0.05)]"
          >
            <div class="action-container flex flex-col md:flex-row gap-4 items-center justify-between max-w-4xl mx-auto">
              <div class="action-info flex items-start gap-3 flex-1">
                <div class="p-2 bg-java-green/10 rounded-lg">
                  <MapPinIcon class="h-5 w-5 text-java-green" />
                </div>
                <div class="flex flex-col">
                  <span class="text-xs font-bold text-gray-800">{{ address || 'Mencari lokasi...' }}</span>
                  <span class="text-[10px] text-gray-500">{{ detailTiket?.visitDistance }}km dari lokasi terdaftar</span>
                </div>
              </div>
              
              <div class="action-buttons flex gap-3 w-full md:w-auto">
                <ButtonPrimary 
                  v-if="detailTiket?.visitStatus === 'TODO'" 
                  text="Check In" 
                  @click="checkIn"
                  class="flex-1 md:flex-none md:min-w-[150px]"
                />
                <ButtonDanger 
                  v-if="detailTiket?.visitStatus === 'INPROGRESS'" 
                  text="Check Out" 
                  @click="checkOut"
                  class="flex-1 md:flex-none md:min-w-[150px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Visit Modal -->
    <PopUpModal v-model:show="showModal" header="Input Detail Kunjungan">
       <div class="flex flex-col gap-6 p-2">
         <div class="bg-gray-50 p-4 rounded-xl flex items-start gap-3">
            <MapPinIcon class="h-5 w-5 text-java-green mt-0.5" />
            <div class="flex flex-col gap-1">
              <span class="text-xs font-bold text-gray-700">{{ address || 'Mencari lokasi...' }}</span>
              <span class="text-[10px] text-gray-500 uppercase">Jarak: {{ detailTiket?.visitDistance }}km</span>
            </div>
         </div>

         <div class="flex flex-col gap-2">
            <span class="text-sm font-bold text-gray-700">Catatan Aktivitas</span>
            <textarea 
              class="w-full border border-gray-200 rounded-xl min-h-[120px] p-4 text-sm text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              placeholder="Masukkan catatan kunjungan..."
              v-model="visitNote"
            ></textarea>
         </div>

         <!-- Photo Product -->
         <div class="flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <span class="text-sm font-bold text-gray-700">Foto Produk</span>
              <span class="text-xs text-gray-400">{{ detailTiket?.visitImage?.product?.length ?? 0 }} Foto</span>
            </div>
            <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <div
                v-for="(im, i) in detailTiket?.visitImage?.product"
                :key="i"
                class="min-w-[100px] aspect-square relative group"
              >
                <NuxtImg
                  class="h-full w-full object-cover rounded-xl shadow-sm border border-gray-100"
                  :src="im"
                  @click="setPreview(im)"
                />
                <button
                  @click.stop="removePhoto('product', i)"
                  class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-lg hover:scale-110 transition-transform"
                >
                  <XMarkIcon class="h-3 w-3" />
                </button>
              </div>
              <div 
                class="min-w-[100px] aspect-square rounded-xl bg-gray-100 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-400 cursor-pointer hover:bg-gray-200 transition-colors"
                @click="takePhoto('product')"
              >
                <CameraIcon class="h-5 w-5" />
                <span class="text-[10px] font-medium">Tambah</span>
              </div>
            </div>
         </div>

         <!-- Photo Location -->
         <div class="flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <span class="text-sm font-bold text-gray-700">Foto Toko / Lokasi</span>
              <span class="text-xs text-gray-400">{{ detailTiket?.visitImage?.location?.length ?? 0 }} Foto</span>
            </div>
            <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <div
                v-for="(im, i) in detailTiket?.visitImage?.location"
                :key="i"
                class="min-w-[100px] aspect-square relative group"
              >
                <NuxtImg
                  class="h-full w-full object-cover rounded-xl shadow-sm border border-gray-100"
                  :src="im"
                  @click="setPreview(im)"
                />
                <button
                  @click.stop="removePhoto('location', i)"
                  class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-lg hover:scale-110 transition-transform"
                >
                  <XMarkIcon class="h-3 w-3" />
                </button>
              </div>
              <div 
                class="min-w-[100px] aspect-square rounded-xl bg-gray-100 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-400 cursor-pointer hover:bg-gray-200 transition-colors"
                @click="takePhoto('location')"
              >
                <CameraIcon class="h-5 w-5" />
                <span class="text-[10px] font-medium">Tambah</span>
              </div>
            </div>
         </div>
       </div>

      <template #footer v-if="detailTiket?.visitStatus !== 'FINISH'">
        <div class="flex gap-3 w-full p-2">
          <ButtonSecondary
            @click="showModal = false"
            text="Batal"
            class="flex-1"
          />
          <ButtonPrimary
            @click="saveVisitData"
            text="Simpan Data"
            class="flex-1"
          />
        </div>
      </template>
    </PopUpModal>

    <!-- History Detail Modal -->
    <PopUpModal v-model:show="showModalHistory" header="Detail Riwayat Kunjungan">
       <div class="flex flex-col gap-6 p-2">
         <div class="flex flex-col md:flex-row justify-between gap-4 bg-gray-50 p-4 rounded-xl">
            <div class="flex items-start gap-3">
              <MapPinIcon class="h-5 w-5 text-java-green mt-0.5" />
              <div class="flex flex-col">
                <span class="text-xs font-bold text-gray-700">{{ historySelected?.visitAddress }}</span>
                <span class="text-[10px] text-gray-500 uppercase">Jarak: {{ historySelected?.visitDistance }}km</span>
              </div>
            </div>
            <div class="flex flex-col gap-2 md:text-right">
              <div class="flex flex-col">
                <span class="text-[10px] text-gray-400 uppercase">Waktu Check-In</span>
                <span class="text-xs font-bold text-gray-700">{{ historySelected?.visitCheckIn ? useString.setDateTimeFormat(new Date(historySelected?.visitCheckIn)) : '-' }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-[10px] text-gray-400 uppercase">Waktu Check-Out</span>
                <span class="text-xs font-bold text-gray-700">{{ historySelected?.visitCheckOut ? useString.setDateTimeFormat(new Date(historySelected?.visitCheckOut)) : '-' }}</span>
              </div>
            </div>
         </div>

         <div class="flex flex-col gap-2">
            <span class="text-sm font-bold text-gray-700">Catatan Aktivitas</span>
            <div class="bg-white border border-gray-100 p-4 rounded-xl text-sm text-gray-600 italic">
              " {{ historySelected?.visitNote || 'Tidak ada catatan' }} "
            </div>
         </div>

         <!-- History Photos -->
         <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div class="flex flex-col gap-3">
              <span class="text-sm font-bold text-gray-700">Foto Produk</span>
              <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <div
                  v-for="(im, i) in historySelected?.visitImage?.product"
                  :key="i"
                  class="min-w-[100px] aspect-square"
                >
                  <NuxtImg
                    class="h-full w-full object-cover rounded-xl shadow-sm border border-gray-100"
                    :src="im"
                    @click="setPreview(im)"
                  />
                </div>
              </div>
           </div>
           <div class="flex flex-col gap-3">
              <span class="text-sm font-bold text-gray-700">Foto Lokasi</span>
              <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <div
                  v-for="(im, i) in historySelected?.visitImage?.location"
                  :key="i"
                  class="min-w-[100px] aspect-square"
                >
                  <NuxtImg
                    class="h-full w-full object-cover rounded-xl shadow-sm border border-gray-100"
                    :src="im"
                    @click="setPreview(im)"
                  />
                </div>
              </div>
           </div>
         </div>
       </div>
    </PopUpModal>

    <!-- Image Preview Overlay -->
    <Transition name="fade">
      <div 
        v-if="preview" 
        class="fixed inset-0 bg-black/90 backdrop-blur-sm z-[999] flex items-center justify-center p-4"
        @click="preview = false"
      >
        <button class="absolute top-6 right-6 text-white bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
          <XMarkIcon class="h-8 w-8" />
        </button>
        <div class="max-w-full max-h-full">
          <NuxtImg
            :src="previewSrc"
            class="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  CameraIcon, 
  ChevronLeftIcon, 
  UserIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  XMarkIcon,
  UserGroupIcon
} from '@heroicons/vue/24/outline'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import ImageKit from 'imagekit';
import { useNavbarStore } from '~/stores/navbar';
import { useUserStore } from '~/stores/user';
import { type VisitHistory, type Tiket } from '~/types/user';

// Stores & State
const useNavbar = useNavbarStore();
const userStore = useUserStore();
const sysConfig = useSystemConfig();
const route = useRoute();
const router = useRouter();
const useString = useUseString();
const numberFormatting = useNumber();

// Composables
const {
  coords,
  address,
  getLocation,
  calculateDistance,
  calculateDistanceRaw,
  isInsideRadius,
} = useUserLocation();

// Reactive State
const allTiket = computed((): Tiket[] => (userStore.allTiket || []).sort((a, b) => {
  return new Date(b?.lastUpdated || 0).getTime() - new Date(a?.lastUpdated || 0).getTime()
}))

const search = ref<string>('')
const tabActive = ref<string>('visit')
const showModal = ref<boolean>(false)
const showModalHistory = ref<boolean>(false)
const preview = ref<boolean>(false)
const previewSrc = ref<string>("")
const showDetail = ref<boolean>(false)
const visitNote = ref<string>("")

// Computed
const detailTiket = computed(() => {
  return allTiket.value.find((tiket) => tiket?.customerNo === route?.query?.id) as Tiket
})

const historyVisit = computed(() => {
  return userStore.visitHistory?.filter((visit) => visit?.customerNo === route?.query?.id) ?? []
})

const historySelected = ref<VisitHistory>({} as VisitHistory)
const radius = computed(() => userStore.tollerance || 100)

const historyTransaction = ref<any[]>([
  { invoiceNo: 'INV-001', date: '2025-07-12', type: 'SALES', debit: 1000, credit: 0 },
  { invoiceNo: 'INV-002', date: '2025-07-13', type: 'SALES', debit: 2000, credit: 0 },
])

// Methods
const setTabActive = (tab: string) => {
  tabActive.value = tab
}

const setPreview = (src: string) => {
  preview.value = true
  previewSrc.value = src
}

const goToIncomingPageDetail = (id: string) => {
  showDetail.value = true
  router?.replace({ query: { ...route.query, detail: 'true', id } })
}

const setVisitHistorySelected = (visit: VisitHistory) => {
  showModalHistory.value = true
  historySelected.value = visit
}

// Visit Actions
const checkIn = async () => {
  await getLocation()

  if (coords.value && detailTiket.value) {
    const distanceMeters = calculateDistanceRaw({ lat: detailTiket.value.lat, lng: detailTiket.value.lng })
    
    if (distanceMeters !== null) {
      if (detailTiket.value.visitStatus === 'TODO') {
      detailTiket.value.visitCheckIn = new Date().toISOString()
      detailTiket.value.visitStatus = 'INPROGRESS'
    }
    
    detailTiket.value.lastUpdated = new Date().toISOString()    
    detailTiket.value.visitLat = coords.value.lat
    detailTiket.value.visitLng = coords.value.lng
    detailTiket.value.visitAddress = address.value
    detailTiket.value.visitDate = new Date().toISOString()
      detailTiket.value.visitDistance = parseFloat((distanceMeters / 1000).toFixed(2))
      
      showModal.value = true
    }
  }
}

const saveVisitData = async () => {
  if (detailTiket.value) {
    detailTiket.value.visitNote = visitNote.value
    showModal.value = false
  }
}

const checkOut = async () => {
  if (detailTiket.value) {
    detailTiket.value.visitStatus = 'FINISH'
    detailTiket.value.lastUpdated = new Date().toISOString()
    detailTiket.value.visitCheckOut = new Date().toISOString()
    userStore.addToHistory(detailTiket.value)
  }
}

// Media Actions
const takePhoto = async (loc: 'location' | 'product') => {
  try {
    const photo = await Camera.getPhoto({
      quality: 80,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    })

    const base64 = photo.base64String
    if(!detailTiket.value.visitImage) {
      detailTiket.value.visitImage = { location: [], product: [] }
    }

    if(base64) {
      const url = await uploadFileImage(base64)
      if (loc === 'location') detailTiket.value.visitImage.location?.push(url)
      else detailTiket.value.visitImage.product?.push(url)
    }
  } catch (error) {
    console.error('Camera Error:', error)
  }
}

const removePhoto = (loc: 'location' | 'product', index: number) => {
  if (!detailTiket.value.visitImage) return
  if (loc === 'location') detailTiket.value.visitImage.location?.splice(index, 1)
  else detailTiket.value.visitImage.product?.splice(index, 1)
}

const uploadFileImage = async (base64: string): Promise<string> => {
  const imageKit = new ImageKit({
    publicKey: sysConfig.public.imagekitPublicKey,
    privateKey: sysConfig.public.imagekitPrivateKey,
    urlEndpoint: sysConfig.public.imagekitUrlEndpoint,
  })

  return new Promise((resolve, reject) => {
    imageKit.upload({
      file: base64,
      fileName: `visit_${Date.now()}.jpg`,
      tags: ['visit']
    }, (err, result) => {
      if (err) reject(err)
      else resolve(result?.url || '')
    })
  })
}

// Lifecycle & Watchers
onMounted(() => {
  if (route.query?.detail) {
    showDetail.value = true
    useNavbar.setHeader('BACK', detailTiket?.value?.customerName ?? '-')
  }
})

watch(() => route.query.id, (newId) => {
  if (route.query.detail && newId) {
    showDetail.value = true
    visitNote.value = detailTiket.value?.visitNote || ""
    useNavbar.setHeader('BACK', detailTiket.value?.customerName || '-')
  } else {
    showDetail.value = false
    useNavbar.setHeader('MAIN')
    visitNote.value = ""
  }
}, { immediate: true })

definePageMeta({
  title: 'Kunjungan',
  layout: 'detail'
})
</script>

<style scoped>
.incoming-page {
  min-height: 100vh;
  background: var(--color-gray-50);
}

.layout-container {
  display: flex;
  height: calc(100vh - 80px);
  overflow: hidden;
}

/* Master Panel */
.customer-list-panel {
  width: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  border-right: 1px solid var(--color-gray-100);
}

@media (min-width: 1024px) {
  .customer-list-panel {
    width: 350px;
    flex-shrink: 0;
  }
}

.search-container {
  padding: 1rem;
  border-bottom: 1px solid var(--color-gray-100);
}

.customer-list {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

/* Detail Panel */
.detail-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--color-gray-50);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 1.5rem;
}

.empty-icon {
  padding: 2rem;
  background: white;
  border-radius: 50%;
  box-shadow: var(--shadow-sm);
}

.detail-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.detail-header {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;
}

.back-button {
  padding: 0.5rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  transition: background 0.2s;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.detail-scroll-area {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-card {
  padding: 1.5rem;
  border-radius: 1.25rem;
  border: 1px solid white;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-item.col-span-2 {
  grid-column: span 2;
}

.info-label {
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--color-gray-400);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  font-size: 0.85rem;
  color: var(--color-gray-800);
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-gray-500);
  transition: all 0.2s;
}

.tab-button.tab-active {
  background: white;
  color: var(--color-primary);
  box-shadow: var(--shadow-sm);
}

.action-footer {
  border-radius: 1.5rem 1.5rem 0 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>