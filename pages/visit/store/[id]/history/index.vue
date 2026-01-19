<template>
  <div>
    <CardNavbarBack title="Riwayat Kunjungan" />
    <div class="flex flex-col gap-1 px-3">
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
      <div class="flex flex-row gap-2 bg-white border rounded-sm shadow-sm w-full px-3 py-2 items-start hover:bg-gray-100 hover:cursor-pointer" v-for="(v, i) in historyVisit" :key="i">
        <div class="flex flex-col gap-0 w-full" @click="setVisitHistorySelected(v)">
          <div class="flex flex-row justify-between">
            <span class="text-sm text-gray-400">#salesID</span>
            <span class="text-sm text-red-500 uppercase">{{ useString.setDateTimeFormat(new Date(v.visitDate)) }}</span>
          </div>
          <span class="text-sm uppercase">{{ v.userVisitName }}</span>
          <span class="text-sm text-gray-400 truncate mt-2 max-w-[90%]">{{ v.visitNote }}</span>
        </div>
      </div>
    </div>
    
    <PopUpModal v-model:show="showModalHistory" header="Informasi Detail Kunjungan">
      <!-- Body -->
       <div class="flex flex-col justify-between items-start max-lg:px-0 px-5 max-lg:text-sm">
        <span class="text-sm flex flex-row gap-2">
          <MapPinIcon class="h-4 w-4" />
          <div class="flex flex-col gap-1">
            <span>{{ historySelected?.visitAddress }}</span>
          </div>
        </span>
        <div class="flex flex-row gap-2 justify-between items-center w-full mt-3">
          <span class="font-semibold flex flex-col">Mulai Kunjungan <span class="font-normal text-gray-500">{{ historySelected?.visitCheckIn ? useString.setDateTimeFormat(new Date(historySelected?.visitCheckIn)) : '-' }}</span></span>
          <span class="font-semibold flex flex-col">Selesai Kunjungan <span class="font-normal text-gray-500">{{ historySelected?.visitCheckOut ? useString.setDateTimeFormat(new Date(historySelected?.visitCheckOut)) : '-' }}</span></span>
        </div>
       </div>

       <div class="flex flex-col gap-1 w-full max-lg:text-sm mt-5">
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
                  class="h-full w-full object-cover rounded-sm hover:cursor-zoom-in"
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
                  class="h-full w-full object-cover rounded-sm hover:cursor-zoom-in"
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
import { useUserStore } from '~/stores/user'
import type { VisitHistory } from '~/types/user'
import { MapPinIcon, ArchiveBoxXMarkIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const useString = useUseString()
const customerId = route?.params?.id as string
const useStore = useUserStore()
const showModalHistory = ref<boolean>(false);
const historySelected = ref<VisitHistory>({} as VisitHistory)
const preview = ref<boolean>(false)
const previewSrc = ref<string>("")
const historyVisit = computed(() => {
  return useStore.visitHistory?.filter((visit) => visit?.customerNo === customerId) ?? []
})

const setVisitHistorySelected = (visit: VisitHistory) => {
  showModalHistory.value = true
  historySelected.value = visit
}
const setPreview = (src: string) => {
  preview.value = true
  previewSrc.value = src
}

</script>

<style>

</style>