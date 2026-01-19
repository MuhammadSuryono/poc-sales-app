<template>
  <div class="flex flex-col bg-gray-100">
    <CardNavbarBack title="Input Kunjungan">
      <template #right>
        <NavbarCart />
      </template>
    </CardNavbarBack>
    <client-only>
      <Maps :lat="userLocation?.coords.value.lat" :lng="userLocation?.coords.value.lng" />
    </client-only>
    <div class="text-sm flex flex-row gap-2 items-start px-2 py-4">
      <div class="w-[5%] text-center text-danger">
        <MapPinIcon class="h-5 w-5" />
      </div>
      <div class="flex flex-col gap-1">
        <span>{{ detailTiket?.visitAddress }}</span>
        <div class="flex flex-row items-center">
          <span class="text-danger text-xs">Anda berada {{ distance }} dari lokasi</span>
          <span class="flex flex-row gap-1 py-1 px-3 w-fit cursor-pointer items-center text-xs" @click="reGetLocation" v-if="!insideRadius">
            <ArrowPathIcon class="h-4 w-4" />
          </span>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-2 p-3 mt-3 border-t rounded-2xl bg-white">
      <div class="flex flex-col gap-5 justify-between items-start max-lg:px-0 px-5 text-sm">
        <div class="flex flex-row justify-between w-full gap-2">
          <span class="font-semibold flex flex-col">Mulai Kunjungan <span class="font-normal text-gray-500">{{ detailTiket?.visitCheckIn ? useString.setDateTimeFormat(new Date(detailTiket?.visitCheckIn)) : '-' }}</span></span>
          <span class="font-semibold flex flex-col">Selesai Kunjungan <span class="font-normal text-gray-500">{{ detailTiket?.visitCheckOut ? useString.setDateTimeFormat(new Date(detailTiket?.visitCheckOut)) : '-' }}</span></span>
        </div>
      </div>

      <div class="flex flex-col gap-1 w-full mt-5 text-sm">
        <span>Aktivitas</span>
        <textarea class="w-full border rounded-sm max-lg:h-30 h-45 px-3 py-3 text-gray-700 text-sm" v-model="visitNote"></textarea>

        <div class="flex flex-col gap-2 mt-3" v-if="user?.role === 'COLLECTOR'">
          <span class="font-semibold">Balance: {{ useUseString()?.setNumberFormat(detailTiket?.balance) }}</span>
          <FormInput label="Nilai Pembayaran" placeholder="500000" type="text" v-model="visitPayment" />
        </div>

        <div class="mt-3 flex flex-col gap-1 mt-8" v-if="user?.role === 'SALES'">
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
                  class="max-w-[120px] h-[120px] object-cover rounded-xs hover:cursor-zoom-in"
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
      
      <div class="flex flex-row gap-2 items-center justify-end mt-5 py-3">
        <ButtonSecondary text="Batal" class="w-fit text-sm font-normal box-shadow-full" @click="router.go(-1)"/>
        <ButtonPrimary text="Simpan" class="w-fit font-normal  box-shadow-full" @click="saveVisitData" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '~/stores/user';
import type { Tiket, User } from '~/types/user';
import { MapPinIcon, CameraIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import ImageKit from 'imagekit';
import { useLoadingState } from '~/stores/loading';
import { useNotificationStore } from '~/stores/notification';

const useStore = useUserStore()
const user = computed(() => useStore?.user as User)
const useNotification = useNotificationStore();
const allTiket = computed((): Tiket[] => useStore.getAllTiketUser()?.sort((a, b) => {
  return new Date(b?.lastUpdated).getTime() - new Date(a?.lastUpdated).getTime()
}))

const route = useRoute();
const router = useRouter();
const detailTiket = computed(() => {
  return allTiket.value.find((tiket) => tiket?.customerNo === route?.params?.id) as Tiket
})
const userLocation = useUserLocation()
const distance = computed(() => userLocation.calculateDistance({
  lat: detailTiket.value?.lat,
  lng: detailTiket.value?.lng
}))
const insideRadius = computed((): boolean => detailTiket.value ? userLocation.isInsideRadius({
  lat: detailTiket.value?.lat,
  lng: detailTiket.value?.lng
}, useStore.tollerance) : false)

const useString = useUseString()
const preview = ref<boolean>(false)
const previewSrc = ref<string>("")
const visitNote = ref<string | undefined>(detailTiket.value?.visitNote ?? '-')
const visitPayment = ref<string>(detailTiket.value?.visitPayment ?? '0')
const useLoading = useLoadingState()

const setPreview = (src: string) => {
  preview.value = true
  previewSrc.value = src
}

const saveVisitData = async () => {
  useLoading.setLoading('Data sedang disimpan...')
  detailTiket.value.visitNote = visitNote.value
  detailTiket.value.visitPayment = visitPayment.value
  
  setTimeout(() => {
    useLoading.disLoading()
    useNotification.toggle('Berhasil disimpan')
  }, 3000)
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
    useLoading.setLoading('Sedang mengunggah...')
    url = await uploadFileImage(base64)
    useLoading.disLoading()
  }

  if (loc === 'location' && url ) {
    detailTiket.value.visitImage.location?.push(url)
    useNotification.toggle('Berhasil diunggah dan disimpan')
  } else if (loc === 'product' && url ) {
    detailTiket.value.visitImage.product?.push(url)
    useNotification.toggle('Berhasil diunggah dan disimpan')
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

const reGetLocation = async () => {
  useLoading.setLoading('Sedang mengambil lokasi...')
  await userLocation.getLocation()
  detailTiket.value.visitAddress = userLocation.address
  useLoading.disLoading()
}
</script>

<style>

</style>