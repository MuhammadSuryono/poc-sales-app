<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <CardNavbarBack title="Input Kunjungan">
      <template #right>
        <NavbarCart class="text-white" />
      </template>
    </CardNavbarBack>
    <div class="bg-white border-b border-gray-100">
      <client-only>
        <Maps :lat="userLocation?.coords.value.lat" :lng="userLocation?.coords.value.lng" />
      </client-only>
    </div>
    <div class="px-4 py-4">
      <div class="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        <div class="flex items-start gap-3">
          <div class="p-2 bg-java-green/10 rounded-lg">
            <MapPinIcon class="h-5 w-5 text-java-green" />
          </div>
          <div class="flex-1">
            <div class="text-xs font-bold text-gray-700">{{ detailTiket?.visit_address }}</div>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-[11px] text-gray-500">Jarak dari lokasi: {{ distance }}km</span>
              <button 
                v-if="!insideRadius"
                class="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 active:scale-95 transition"
                @click="reGetLocation"
              >
                <ArrowPathIcon class="h-4 w-4 text-gray-600" />
                <span class="text-gray-600">Perbarui lokasi</span>
              </button>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3 mt-4">
          <div class="flex flex-col">
            <span class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none mb-1">Waktu Check-In</span>
            <span class="text-xs font-black text-gray-700 block tracking-tight">{{ detailTiket?.visit_check_in ? useString.setDateTimeFormat(new Date(detailTiket?.visit_check_in)) : '-' }}</span>
          </div>
          <div class="flex flex-col items-end">
            <span class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none mb-1">Waktu Check-Out</span>
            <span class="text-xs font-black text-gray-700 block tracking-tight">{{ detailTiket?.visit_check_out ? useString.setDateTimeFormat(new Date(detailTiket?.visit_check_out)) : '-' }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm mt-4 mb-16">
        <div class="flex flex-col gap-2">
          <span class="text-sm font-bold text-gray-700">Catatan Aktivitas</span>
          <textarea 
            class="w-full border border-gray-200 rounded-xl min-h-[120px] p-4 text-sm text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            placeholder="Masukkan catatan kunjungan..."
            v-model="visitNote"
          ></textarea>
        </div>

        <div class="flex flex-col gap-2 mt-3" v-if="user?.role === 'COLLECTOR'">
          <span class="text-sm font-bold text-gray-700">Balance: {{ useUseString()?.setNumberFormat(detailTiket?.balance) }}</span>
          <FormInput label="Nilai Pembayaran" placeholder="cth: 500000" type="text" v-model="visitPayment" />
        </div>

        <div class="mt-5 flex flex-col gap-3" v-if="user?.role === 'SALES'">
          <div class="flex items-center justify-between">
            <span class="text-sm font-bold text-gray-700">Foto Produk</span>
            <span class="text-xs text-gray-400">{{ visitImage?.filter((item) => item.category === 'product').length ?? 0 }} Foto</span>
          </div>

          <div class="flex flex-row gap-1 items-start">
            <div class="flex flex-row gap-1 overflow-x-auto scrollbar-hide max-w-[90%]">
              <div
                v-for="(im, i) in visitImage?.filter((item) => item.category === 'product')"
                :key="i"
                class="min-w-[100px] aspect-square relative group"
              >
                <NuxtImg
                  class="h-full w-full object-cover rounded-xl shadow-sm border border-gray-100 hover:cursor-zoom-in"
                  :src="im.url"
                  @click="setPreview(im.url)"
                />

                <button
                  @click.stop="removePhoto('location', im.id)"
                  class="absolute top-1 right-1 bg-black/60 text-white text-[10px] px-1 rounded-md hover:bg-red-600 transition"
                  title="Hapus gambar"
                >
                  ✕
                </button>
              </div>
            </div>

            <div class="min-w-[100px] aspect-square rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 text-sm cursor-pointer hover:bg-gray-200 border border-gray-200" 
              @click="takePhoto('product')">
              <CameraIcon class="h-4 w-4" />
            </div>
          </div>
        </div>
        <div class="mt-5 flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <span class="text-sm font-bold text-gray-700">Foto Toko / Lokasi / Pelanggan</span>
            <span class="text-xs text-gray-400">{{ visitImage?.filter((item) => item.category === 'location').length ?? 0 }} Foto</span>
          </div>

          <div class="flex flex-row gap-1 items-start">
            <div class="flex flex-row gap-1 overflow-x-auto scrollbar-hide max-w-[90%]">
              <div
                v-for="(im, i) in visitImage?.filter((item) => item.category === 'location')"
                :key="i"
                class="min-w-[100px] aspect-square relative group"
              >
                <NuxtImg
                  class="h-full w-full object-cover rounded-xl shadow-sm border border-gray-100 hover:cursor-zoom-in"
                  :src="im.url"
                  @click="setPreview(im.url)"
                />

                <button
                  @click.stop="removePhoto('location', im.id)"
                  class="absolute top-1 right-1 bg-black/60 text-white text-[10px] px-1 rounded-md hover:bg-red-600 transition"
                  title="Hapus gambar"
                >
                  ✕
                </button>
              </div>
            </div>

            <div class="min-w-[100px] aspect-square rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 text-sm cursor-pointer hover:bg-gray-200 border border-gray-200" 
              @click="takePhoto('location')">
              <CameraIcon class="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
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
      
      <div class="fixed inset-x-0 bottom-0 z-40 pb-2 px-4 safe-area-bottom">
        <div class="bg-white border-t border-gray-100 rounded-t-2xl shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.08)] p-3 flex items-center justify-end gap-3">
          <ButtonSecondary text="Batal" class="font-normal" @click="router.go(-1)"/>
          <ButtonPrimary text="Simpan" class="font-normal" @click="saveVisitData" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '~/stores/user';
import { type VisitImage, type Tiket, type User } from '~/types/user';
import { MapPinIcon, CameraIcon, ArrowPathIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import ImageKit from 'imagekit';
import { useLoadingState } from '~/stores/loading';
import { useNotificationStore } from '~/stores/notification';

const useStore = useUserStore()
const user = computed(() => useStore?.user as User)
const useNotification = useNotificationStore();
const allTiket = computed((): Tiket[] => useStore.getAllTiketUser()?.sort((a, b) => {
  return new Date(b?.last_updated).getTime() - new Date(a?.last_updated).getTime()
}))
const visitImage = ref<VisitImage[]>([])
const visitImageRemove = ref<string[]>([])

const route = useRoute();
const router = useRouter();
const detailTiket = computed(() => {
  return allTiket.value.find((tiket) => tiket?.customer_no === route?.params?.id) as Tiket
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
const visitNote = ref<string | undefined>(detailTiket.value?.visit_note ?? '-')
const visitPayment = ref<string>(detailTiket.value?.visit_payment ?? '0')
const useLoading = useLoadingState()

const setPreview = (src: string) => {
  preview.value = true
  previewSrc.value = src
}

const saveVisitData = async () => {
  useLoading.setLoading('Data sedang disimpan...')
  detailTiket.value.visit_note = visitNote.value
  detailTiket.value.visit_payment = visitPayment.value

  await useStore.updateTicketData(detailTiket.value)
  await useStore.saveBatchVisitImage(visitImage.value, visitImageRemove.value)
  useLoading.disLoading()
  useNotification.toggle('Berhasil disimpan')
}

const takePhoto = async (loc: string) => {
  const photo = await Camera.getPhoto({
    quality: 80,
    resultType: CameraResultType.Base64,
    source: CameraSource.Camera // bisa juga .Prompt atau .Photos
  })

  const base64 = photo.base64String

  let url = ''
  if(base64) {
    useLoading.setLoading('Sedang mengunggah...')
    url = await uploadFileImage(base64)
    useLoading.disLoading()
  }

  if (!detailTiket.value?.id) {
    throw new Error('Tiket ID is undefined')
  }

  if (!url) {
    throw new Error('Failed to upload image')
  }

  visitImage.value.push({
    id: useString.uuidv4(),
    visit_id: detailTiket.value?.id as string,
    category: loc,
    url,
  })
}

const removePhoto = (loc: string, id: string) => {
  visitImage.value = visitImage.value.filter((im) => im.id !== id)
  visitImageRemove.value.push(id)
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
  detailTiket.value.visit_address = userLocation.address
  useLoading.disLoading()
}

onMounted(async () => {
  if (allTiket.value.length === 0) {
    await useStore.fetchAllTiketUser()
  }
  visitImage.value = await useStore.fetchVisitImage(detailTiket.value?.id as string)
})
</script>

<style>

</style>
