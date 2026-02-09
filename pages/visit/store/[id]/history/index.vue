<template>
  <div class="mt-8">
    <CardNavbarBack title="Riwayat Kunjungan" />
    <div class="flex flex-col gap-2 px-3">
      <NotFound v-if="historyVisit?.length === 0" text="Data riwayat kunjungan kosong" :use-title="false">
        <template #cta>
          <ButtonRefresh :action="() => console.log('refresh')" />
        </template>
        <template #icon>
          <div class="flex items-center justify-center">
            <ArchiveBoxXMarkIcon class="h-12 w-12 text-gray-400" />
          </div>
        </template>
      </NotFound>
      <div
        v-for="(v, i) in historyVisit"
        :key="i"
        class="bg-white border border-gray-100 rounded-xl shadow-sm w-full p-4 hover:bg-gray-50 hover:shadow-md cursor-pointer"
        @click="setVisitHistorySelected(v)"
      >
        <div class="flex items-start justify-between w-full">
          <div class="flex flex-col">
            <span class="text-[10px] text-gray-400 uppercase tracking-[0.2em]">#{{ v.user_id }}</span>
            <span class="text-sm font-bold text-gray-700 uppercase">{{ v.user_visit_name ?? '-' }}</span>
          </div>
          <span class="text-xs text-gray-500">{{ useString.setDateTimeFormat(new Date(v.created_at)) }}</span>
        </div>
        <div class="mt-2 text-sm text-gray-600 truncate">{{ v.visit_note }}</div>
      </div>
    </div>
    
    <PopUpModal v-model:show="showModalHistory" header="Detail Riwayat Kunjungan">
      <div class="flex flex-col gap-6 p-2">
        <div class="flex flex-col md:flex-row justify-between gap-4 bg-gray-50 p-4 rounded-xl">
          <div class="flex items-start gap-3">
            <MapPinIcon class="h-5 w-5 text-java-green mt-0.5" />
            <div class="flex flex-col">
              <span class="text-xs font-bold text-gray-700">{{ historySelected?.visit_address }}</span>
              <span class="text-[10px] text-gray-500 uppercase">Jarak: {{ historySelected?.visit_distance ? (historySelected?.visit_distance + 'km') : '-' }}</span>
            </div>
          </div>
          <div class="flex flex-col gap-2 md:text-right">
            <div class="flex flex-col">
              <span class="text-[10px] text-gray-400 uppercase">Waktu Check-In</span>
              <span class="text-xs font-bold text-gray-700">{{ historySelected?.visit_check_in ? useString.setDateTimeFormat(new Date(historySelected?.visit_check_in)) : '-' }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-[10px] text-gray-400 uppercase">Waktu Check-Out</span>
              <span class="text-xs font-bold text-gray-700">{{ historySelected?.visit_check_out ? useString.setDateTimeFormat(new Date(historySelected?.visit_check_out)) : '-' }}</span>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <span class="text-sm font-bold text-gray-700">Catatan Aktivitas</span>
          <div class="bg-white border border-gray-100 p-4 rounded-xl text-sm text-gray-600 italic">
            {{ historySelected?.visit_note || 'Tidak ada catatan' }}
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <span class="text-sm font-bold text-gray-700">Foto Produk</span>
              <span class="text-xs text-gray-400">{{ visitImages?.filter(a => a.category === 'product' || []).length ?? 0 }} Foto</span>  
            </div>
            <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <div
                v-for="(im, i) in visitImages?.filter(a => a.category === 'product' || [])"
                :key="i"
                class="min-w-[100px] aspect-square"
              >
                <NuxtImg
                  class="h-full w-full object-cover rounded-xl shadow-sm border border-gray-100"
                  :src="im.url"
                  @click="setPreview(im.url)"
                />
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <span class="text-sm font-bold text-gray-700">Foto Lokasi</span>
              <span class="text-xs text-gray-400">{{ visitImages.filter(a => a.category === 'location' || []).length ?? 0 }} Foto</span>
            </div>
            <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <div
                v-for="(im, i) in visitImages.filter(a => a.category === 'location' || [])"
                :key="i"
                class="min-w-[100px] aspect-square"
              >
                <NuxtImg
                  class="h-full w-full object-cover rounded-xl shadow-sm border border-gray-100"
                  :src="im.url"
                  @click="setPreview(im.url)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex gap-3 w-full p-2">
          <ButtonSecondary
            @click="showModalHistory = false"
            text="Tutup"
            class="flex-1"
          />
        </div>
      </template>
    </PopUpModal>
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
import { useUserStore } from '~/stores/user'
import { type VisitImage, type VisitHistory } from '~/types/user'
import { MapPinIcon, ArchiveBoxXMarkIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const useString = useUseString()
const customerId = route?.params?.id as string
const useStore = useUserStore()
const showModalHistory = ref<boolean>(false);
const historySelected = ref<VisitHistory>({} as VisitHistory)
const visitImages = ref<VisitImage[]>([])
const preview = ref<boolean>(false)
const previewSrc = ref<string>("")
const historyVisit = computed(() => useStore.visitHistory || [])
const visitImageLocation = computed(() => visitImages?.value?.filter(a => a.category === 'location' || []))
const visitImageProduct = computed(() => visitImages?.value?.filter(a => a.category === 'product' || []))

const setVisitHistorySelected = async (visit: VisitHistory) => {
  visitImages.value = []
  showModalHistory.value = true
  historySelected.value = visit
  visitImages.value = await useStore.fetchVisitImage(historySelected.value.visit_id) || []
}
const setPreview = (src: string) => {
  preview.value = true
  previewSrc.value = src
}

onMounted(async () => {
  await useStore.fetchVisitHistory(customerId)
})

</script>

<style>

</style>
