<template>
  <div class="bg-white w-full shadow-sm rounded-sm px-3 py-3 flex flex-row gap-3">
    <div class="h-screen[calc(100vh-12rem)] lg:border-r w-full lg:w-[30%] flex flex-col gap-1 pr-2"
        :class="{'hidden lg:block': showDetail, 'block': !showDetail}">
      <FormInput v-model="search" placeholder="Search data..." class="w-full">
        <template #icon>
          <MagnifyingGlassIcon class="h-3 w-3" />
        </template>
      </FormInput>

      <div class="flex flex-col mt-5 h-[calc(100vh-12rem)] overflow-auto  scrollbar-hide">
        <CustomerIncoming v-for="(dt, i) in allTiket" :tiketData="dt" :key="i" @detail="goToIncomingPageDetail" />
      </div>
    </div>
    <div class="w-full lg:w-[70%] flex h-screen[calc(100vh-12rem)] overflow-auto  scrollbar-hide items-center text-center justify-center"
        :class="{'block': showDetail, 'hidden lg:block': !showDetail}"  v-if="!showDetail">
      <span class="text-lg font-semibold">Tidak ada data</span>
    </div>
    <div class="w-full lg:w-[70%] flex flex-col gap-3 h-screen[calc(100vh-16rem)] overflow-auto  scrollbar-hide"
        :class="{'block': showDetail, 'hidden lg:block': !showDetail}" v-if="showDetail">
      <div class="flex flex-row gap-4 justify-start items-center border-b py-3 hidden lg:flex">
        <span class="font-semibold text-lg">{{ detailTiket?.customerName }}</span>
      </div>
      <div class="max-lg:h-[calc(100vh-14rem)] h-[calc(100vh-16rem)] overflow-auto flex flex-col gap-3  scrollbar-hide">
        <div class="border px-3 py-2">
          <span class="text-md">Informasi Pelanggan</span>
          <div class="flex flex-row gap-2 text-xs">
            <div class="w-[50%] flex flex-col gap-1">
              <div class="flex flex-col mt-4">
                <span class="font-semibold ">Customer No.</span>
                <span class="">{{ detailTiket?.customerNo }}</span>
              </div>
              <div class="flex flex-col mt-4">
                <span class="font-semibold ">No. KTP/NPWP</span>
                <span class="">{{ detailTiket?.identityNumber ?? '-' }}</span>
              </div>
              <div class="flex flex-col mt-4">
                <span class="font-semibold ">Customer Name</span>
                <span class="">{{ detailTiket?.customerName ?? '-' }}</span>
              </div>
              <div class="flex flex-col mt-4">
                <span class="font-semibold ">Customer Phone</span>
                <span class="">{{ detailTiket?.customerPhone ?? '-' }}</span>
              </div>
              <div class="flex flex-col mt-4">
                <span class="font-semibold ">Badan Usaha</span>
                <span class="">{{ detailTiket?.badanUsaha ?? '-' }}</span>
              </div>
              <div class="flex flex-col mt-4">
                <span class="font-semibold ">Alamat 1</span>
                <span class="">{{ detailTiket?.alamat ?? '-' }}</span>
              </div>
              <div class="flex flex-col mt-4">
                <span class="font-semibold ">Alamat 2</span>
                <span class="">{{ detailTiket?.alamat2 ?? '-' }}</span>
              </div>
            </div>
            <div class="w-[50%] flex flex-col gap-1">
              <div class="flex flex-col mt-4">
                <span class="font-semibold ">Nama Penjamin</span>
                <span class="">-</span>
              </div>
              <div class="flex flex-col mt-4">
                <span class="font-semibold ">Telepon Penjamin</span>
                <span class="">-</span>
              </div>
              <div class="flex flex-col mt-4">
                <span class="font-semibold ">Balance</span>
                <span class="hover:cursor-pointer hover:underline hover:text-blue-500">Rp. {{ numberFormatting.setNumberFormatWithSeparator(detailTiket?.balance) }}</span>
              </div>
              <div class="flex flex-col mt-4">
                <span class="font-semibold ">Status</span>
                <span class="font-semibold" :class="{'text-red-700': detailTiket?.status === 'MACET', 'text-success': detailTiket?.status === 'LANCAR'}">{{ detailTiket?.status }}</span>
              </div>
            </div>
          </div>
        </div>

        <span class="text-md mt-5">Aktivitas</span>
        <div class="flex flex-row gap-3 border rounded-md w-fit text-sm py-1 px-2 items-center text-center justify-center text-gray-700">
          <span class="rounded-xs hover:cursor-pointer hover:bg-gray-100 py-1 px-2" :class="{'active': tabActive === 'visit'}" @click="setTabActive('visit')">Histori Kunjungan</span>
          <span class="rounded-xs hover:cursor-pointer hover:bg-gray-100 py-1 px-2" :class="{'active': tabActive === 'history'}" @click="setTabActive('history')">Balance</span>
        </div>
        <div class="flex flex-col gap-1" v-if="tabActive === 'visit'">
          <div class="flex flex-row gap-2 bg-white border rounded-sm shadow-sm w-full px-3 py-2 items-start hover:bg-gray-100 hover:cursor-pointer" v-for="(v, i) in historyVisit" :key="i">
            <div class="flex flex-col gap-0 w-full" @click="setVisitHistorySelected(v)">
              <div class="flex flex-row justify-between">
                <span class="text-xs text-gray-400">#salesID</span>
                <span class="text-xs text-red-500 uppercase">{{ useString.setDateTimeFormat(new Date(v.visitDate)) }}</span>
              </div>
              <span class="text-sm uppercase">{{ v.userVisitName }}</span>
              <span class="text-xs text-gray-400 truncate mt-2 max-w-[90%]">{{ v.visitNote }}</span>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-1" v-if="tabActive === 'history'">
          <div class="lg:w-full mx-auto bg-white p-4 rounded shadow font-mono text-sm">
            <!-- Header -->
            <div class="grid grid-cols-5 font-bold border-b pb-2">
              <div>#Invoice</div>
              <div>Deskripsi</div>
              <div class="text-center">Qty</div>
              <div class="text-right">Subtotal</div>
              <div class="text-right">Total</div>
            </div>

            <!-- Data Row -->
            <div class="grid grid-cols-5 py-2 border-b">
              <div>111</div>
              <div>Asa</div>
              <div class="text-center">1</div>
              <div class="text-right">10.000</div>
              <div class="text-right">10.000</div>
            </div>

            <!-- Grand Total -->
            <div class="grid grid-cols-5 font-bold pt-3">
              <div class="col-span-4 text-right">Grand Total:</div>
              <div class="text-right">10.000</div>
            </div>
          </div>

        </div>
      </div>
      <div class="w-full bg-white border-t p-2 rounded-t-md" style="box-shadow: 0 -4px 6px -1px rgba(0,0,0,0.1), 0 -2px 4px -2px rgba(0,0,0,0.1);" v-if="detailTiket?.visitStatus !== 'FINISH'">
        <div class="flex max-lg:flex-col max-lg:gap-3 items-center justify-between">
          <span class="text-xs flex flex-row gap-2">
            <MapPinIcon class="h-4 w-4" />
            <span class="text-danger" v-if="detailTiket?.visitStatus === 'TODO'">Anda belum melakukan "Check In"</span>
            <span class="text-danger" v-if="detailTiket?.visitStatus === 'INPROGRESS'">{{ insideRadius ? 'Anda berada di dalam radius' : 'Anda berada di luar radius' }}</span>
          </span>
          <div class="flex max-lg:flex-col flex-row gap-2 max-lg:w-full">
            <ButtonSecondary
              v-if="detailTiket?.visitStatus === 'INPROGRESS'"
              @click="showModal = true"
              text="Input Detail Kunjungan"
            />
            <ButtonSuccess v-if="detailTiket?.visitStatus === 'TODO'" text="Check In" @click="checkIn(detailTiket?.lat, detailTiket?.lng)" />
            <ButtonDanger v-if="detailTiket?.visitStatus === 'INPROGRESS'" text="Check Out" @click="checkOut" />
          </div>
        </div>
      </div>
    </div>
    
    <PopUpModal v-model:show="showModal" header="Input Detail Kunjungan">
      <!-- Body -->
       <div class="flex flex-row justify-between items-start max-lg:px-0 px-5 max-lg:text-xs">
        <span class="text-xs flex flex-row gap-2">
          <MapPinIcon class="h-4 w-4" />
          <div class="flex flex-col gap-1">
            <span>{{ detailTiket?.visitAddress }}</span>
            <span class="text-danger">{{ insideRadius ? 'Anda berada dalam radius ' + detailTiket?.visitDistance + ' meter dari lokasi konsumen' : 'Anda berada di luar radius' }}</span>
            <span class="flex flex-row gap-1 py-1 px-3 rounded-xs border w-fit cursor-pointer" @click="checkIn(detailTiket?.lat, detailTiket?.lng)" v-if="!insideRadius"><ArrowPathRoundedSquareIcon class="h-4 w-4" /> Ambil Lokasi</span>
          </div>
        </span>
        <div class="flex flex-col gap-2">
          <span class="font-semibold flex flex-col">Mulai Kunjungan <span class="font-normal text-gray-500">{{ detailTiket?.visitCheckIn ? useString.setDateTimeFormat(new Date(detailTiket?.visitCheckIn)) : '-' }}</span></span>
          <span class="font-semibold flex flex-col">Selesai Kunjungan <span class="font-normal text-gray-500">{{ detailTiket?.visitCheckOut ? useString.setDateTimeFormat(new Date(detailTiket?.visitCheckOut)) : '-' }}</span></span>
        </div>
       </div>

       <div class="flex flex-col gap-1 w-full max-lg:text-xs">
        <span>Aktivitas</span>
        <textarea class="w-full border rounded-sm max-lg:h-30 h-45 px-3 py-3 text-gray-700 text-sm" v-model="visitNote"></textarea>

        <div class="mt-3 flex flex-col gap-1">
          <span>Foto Produk ({{ detailTiket?.visitImage?.product?.length ?? 0 }})</span>

          <div class="flex flex-row gap-1 items-start">
            <!-- Scrollable Thumbnail Container -->
            <div class="flex flex-row gap-1 items-start">
            <!-- Scrollable Thumbnail Container -->
            <div class="flex flex-row gap-1 overflow-x-auto scrollbar-hide max-w-[90%]">
              <div
                v-for="(im, i) in detailTiket?.visitImage?.product"
                :key="i"
                class="min-w-[120px] h-[120px] relative group"
              >
                <!-- Gambar -->
                <NuxtImg
                  class="h-full w-full object-cover rounded-xs hover:cursor-zoom-in"
                  :src="im"
                  @click="setPreview(im)"
                />

                <!-- Tombol hapus di pojok kanan atas -->
                <button
                  @click.stop="removePhoto('location', i)"
                  class="absolute top-1 right-1 bg-black bg-opacity-60 text-white text-[10px] px-1 rounded-sm hover:bg-red-600 transition"
                  title="Hapus gambar"
                >
                  ✕
                </button>
              </div>
            </div>

            <!-- Add Button -->
            <div class="min-w-[120px] h-[120px] rounded-xs bg-gray-200 flex items-center justify-center text-gray-500 text-sm cursor-pointer hover:bg-gray-100" 
              @click="takePhoto('product')">
              <CameraIcon class="h-4 w-4" />
            </div>
          </div>
          </div>
        </div>
        <div class="mt-3 flex flex-col gap-1">
          <span>Foto Toko / Lokasi / Pelanggan ({{ detailTiket?.visitImage?.location?.length ?? 0 }})</span>

          <div class="flex flex-row gap-1 items-start">
            <!-- Scrollable Thumbnail Container -->
            <div class="flex flex-row gap-1 overflow-x-auto scrollbar-hide max-w-[90%]">
              <div
                v-for="(im, i) in detailTiket?.visitImage?.location"
                :key="i"
                class="min-w-[120px] h-[120px] relative group"
              >
                <!-- Gambar -->
                <NuxtImg
                  class="h-full w-full object-cover rounded-xs hover:cursor-zoom-in"
                  :src="im"
                  @click="setPreview(im)"
                />

                <!-- Tombol hapus di pojok kanan atas -->
                <button
                  @click.stop="removePhoto('location', i)"
                  class="absolute top-1 right-1 bg-black bg-opacity-60 text-white text-[10px] px-1 rounded-sm hover:bg-red-600 transition"
                  title="Hapus gambar"
                >
                  ✕
                </button>
              </div>
            </div>

            <!-- Add Button -->
            <div class="min-w-[120px] h-[120px] rounded-xs bg-gray-200 flex items-center justify-center text-gray-500 text-sm cursor-pointer hover:bg-gray-100" 
              @click="takePhoto('location')">
              <CameraIcon class="h-4 w-4" />
            </div>
          </div>
        </div>
       </div>

      <!-- Custom Footer -->
      <template #footer v-if="detailTiket?.visitStatus !== 'FINISH'">
        <ButtonSecondary
          @click="showModal = false"
          text="Cancel"
        />
        <ButtonPrimary
          @click="saveVisitData"
          text="Save"
        />
      </template>
    </PopupModal>

    
    
    <PopUpModal v-model:show="showModalHistory" header="Informasi Detail Kunjungan">
      <!-- Body -->
       <div class="flex flex-row justify-between items-start max-lg:px-0 px-5 max-lg:text-xs">
        <span class="text-xs flex flex-row gap-2">
          <MapPinIcon class="h-4 w-4" />
          <div class="flex flex-col gap-1">
            <span>{{ historySelected?.visitAddress }}</span>
          </div>
        </span>
        <div class="flex flex-col gap-2">
          <span class="font-semibold flex flex-col">Mulai Kunjungan <span class="font-normal text-gray-500">{{ historySelected?.visitCheckIn ? useString.setDateTimeFormat(new Date(historySelected?.visitCheckIn)) : '-' }}</span></span>
          <span class="font-semibold flex flex-col">Selesai Kunjungan <span class="font-normal text-gray-500">{{ historySelected?.visitCheckOut ? useString.setDateTimeFormat(new Date(historySelected?.visitCheckOut)) : '-' }}</span></span>
        </div>
       </div>

       <div class="flex flex-col gap-1 w-full max-lg:text-xs">
        <span>Aktivitas</span>
        <span class="w-full border rounded-sm max-lg:h-30 h-45 px-3 py-3 text-gray-700 text-sm">{{ historySelected?.visitNote }}</span>

        <div class="mt-3 flex flex-col gap-1">
          <span>Foto Produk ({{ historySelected?.visitImage?.product?.length ?? 0 }})</span>

          <div class="flex flex-row gap-1 items-start">
            <!-- Scrollable Thumbnail Container -->
            <div class="flex flex-row gap-1 items-start">
            <!-- Scrollable Thumbnail Container -->
            <div class="flex flex-row gap-1 overflow-x-auto scrollbar-hide max-w-[90%]">
              <div
                v-for="(im, i) in historySelected?.visitImage?.product"
                :key="i"
                class="min-w-[120px] h-[120px] relative group"
              >
                <!-- Gambar -->
                <NuxtImg
                  class="h-full w-full object-cover rounded-xs hover:cursor-zoom-in"
                  :src="im"
                  @click="setPreview(im)"
                />
              </div>
            </div>
          </div>
          </div>
        </div>
        <div class="mt-3 flex flex-col gap-1">
          <span>Foto Toko / Lokasi / Pelanggan ({{ historySelected?.visitImage?.location?.length ?? 0 }})</span>

          <div class="flex flex-row gap-1 items-start">
            <!-- Scrollable Thumbnail Container -->
            <div class="flex flex-row gap-1 overflow-x-auto scrollbar-hide max-w-[90%]">
              <div
                v-for="(im, i) in historySelected?.visitImage?.location"
                :key="i"
                class="min-w-[120px] h-[120px] relative group"
              >
                <!-- Gambar -->
                <NuxtImg
                  class="h-full w-full object-cover rounded-xs hover:cursor-zoom-in"
                  :src="im"
                  @click="setPreview(im)"
                />
              </div>
            </div>
          </div>
        </div>
       </div>
    </PopupModal>
    <div
      v-if="preview"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      @click="preview = false"
    >
      <div class="bg-white rounded shadow-xl z-99 p-2 max-w-[90%] max-h-[90%]">
        <NuxtImg
          :src="previewSrc"
          class="min-w-90 max-w-full min-h-90 max-h-[80vh] object-contain"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ButtonDanger, FormInput } from '#components';
import { MagnifyingGlassIcon, ArrowPathRoundedSquareIcon, MapPinIcon, CameraIcon } from '@heroicons/vue/24/outline'
import CustomerIncoming from '~/components/card/CustomerIncoming.vue';
import { useNavbarStore } from '~/stores/navbar';
import { useUserStore } from '~/stores/user';
import { type VisitHistory, type Tiket } from '~/types/user';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import ImageKit from 'imagekit';

const useNavbar = useNavbarStore();
const allTiket = computed((): Tiket[] => useUserStore().allTiket?.sort((a, b) => {
  return new Date(b?.lastUpdated).getTime() - new Date(a?.lastUpdated).getTime()
}))

const search = ref<string>('')
const tabActive = ref<string>('visit')
const showModal = ref<boolean>(false);
const showModalHistory = ref<boolean>(false);
const preview = ref<boolean>(false)
const previewSrc = ref<string>("")
const showDetail = ref<boolean>(false)
const visitNote = ref<string>("")
const route = useRoute()
const router = useRouter()
const useString = useUseString()
const detailTiket = computed(() => {
  return allTiket.value.find((tiket) => tiket?.customerNo === route?.query?.id) as Tiket
})
const historyVisit = computed(() => {
  return useUserStore().visitHistory?.filter((visit) => visit?.customerNo === route?.query?.id) ?? []
})
const historySelected = ref<VisitHistory>({} as VisitHistory)
const radius = computed(() => useUserStore().tollerance)
const insideRadius = computed(() => {
  if (detailTiket.value?.visitDistance) {
    return detailTiket.value?.visitDistance < radius.value
  }
  return false
})
const numberFormatting = useNumber()

const {
  coords,
  address,
  getLocation,
  calculateDistance,
  isInsideRadius,
} = useUserLocation()

const setTabActive = (tab:string) => {
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

onMounted(() => {
  if (route.query?.detail) {
    showDetail.value = true
    useNavbar.setHeader('BACK', detailTiket?.value?.customerName ?? '-')
  }
})

watch(
  route,
  (newRoute) => {
    if (newRoute?.query?.detail && newRoute?.query?.id) {
      showDetail.value = true
      detailTiket.value = allTiket.value.find((tiket) => tiket?.customerNo === newRoute?.query?.id) as Tiket
      visitNote.value = detailTiket.value?.visitNote
      useNavbar.setHeader('BACK', detailTiket?.value?.customerName)
    } else {
      showDetail.value = false
      useNavbar.setHeader('MAIN')
      visitNote.value = ""
    }
  },
  { deep: true }
)

const jarak = ref<number | null>(null)
const dalamRadius = ref(false)

const checkIn = async (lat: number, lng: number) => {
  await getLocation()

  if (coords.value) {
    jarak.value = calculateDistance({ lat, lng })
    dalamRadius.value = isInsideRadius({ lat, lng }, radius.value)

    if (detailTiket.value?.visitStatus === 'TODO') {
      detailTiket.value.visitCheckIn = new Date().toISOString()
      detailTiket.value.visitStatus = 'INPROGRESS'
    }
    
    detailTiket.value.lastUpdated = new Date().toISOString()    
    detailTiket.value.visitLat = coords.value.lat
    detailTiket.value.visitLng = coords.value.lng
    detailTiket.value.visitAddress = address.value
    detailTiket.value.visitDate = new Date().toISOString()
    detailTiket.value.visitDistance = `${(jarak.value / 1000).toFixed(2)}`
  }
}

const saveVisitData = async () => {
  detailTiket.value.visitNote = visitNote.value
  showModal.value = false
  // try {
  //   await useUserStore().updateTiket(detailTiket.value)
  //   showModal.value = false
  // } catch (error) {
  //   console.error(error)
  // }
}

const checkOut = async () => {
  detailTiket.value.visitStatus = 'FINISH'
  detailTiket.value.lastUpdated = new Date().toISOString()
  detailTiket.value.visitCheckOut = new Date().toISOString()
  useUserStore().addToHistory(detailTiket.value)
}

const takePhoto = async (loc: string) => {
  const photo = await Camera.getPhoto({
    quality: 80,
    resultType: CameraResultType.Base64,
    source: CameraSource.Camera // bisa juga .Prompt atau .Photos
  })

  const base64 = photo.base64String
  if(!detailTiket.value.visitImage) {
    detailTiket.value.visitImage = {
      location: [],
      product: [],
    }
  }

  let url = ''
  if(base64) {
    url = await uploadFileImage(base64)
  }

  if (loc === 'location' && url ) {
    detailTiket.value.visitImage.location?.push(url)
  } else if (loc === 'product' && url ) {
    detailTiket.value.visitImage.product?.push(url)
  } else {
    throw new Error('Ivalid location type')
  }
}

const removePhoto = (loc: string, index: number) => {
  if (loc === 'location' && detailTiket.value.visitImage?.location) {
    detailTiket.value.visitImage.location.splice(index, 1)
  } else if (loc === 'product' && detailTiket.value.visitImage?.product) {
    detailTiket.value.visitImage.product.splice(index, 1)
  } else {
    console.error('Invalid location type')
  }
}

const setVisitHistorySelected = (visit: VisitHistory) => {
  showModalHistory.value = true
  historySelected.value = visit
}

const uploadFileImage = async (base64: string) => {
  var imageKit = new ImageKit({
    publicKey: 'public_YDItt1VSL6u4i7HNJbibSbKvz8c=',
    privateKey: 'private_dOZ52fF/0ykIueIq5Xgao9SFbMs=',
    urlEndpoint: 'https://ik.imagekit.io/yono1997',
  })
  return new Promise<string>((resolve, reject) => {
    imageKit.upload(
      {
        file: base64,
        fileName: 'sample.jpg',
        tags: ['sample'],
      },
      (err, result) => {
        if (err) return reject(err)
        if (result?.url) return resolve(result.url)
        reject(new Error('Upload failed'))
      }
    )
  })
}
</script>

<style>
.active {
  border-color: var(--color-primary);
  border-width: 0 0 0 3px;
  background-color: var(--color-color-10);
  color: var(--color-primary);
}
</style>