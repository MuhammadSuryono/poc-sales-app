<template>
  <div class="flex flex-row gap-2 bg-white border rounded-sm shadow-sm w-full px-3 py-2 items-start hover:bg-gray-100 hover:cursor-pointer">
    <div class="w-[10%]">
      <BuildingStorefrontIcon class="h-8 w-8 rounded-full text-gray-500 hover:cursor-pointer" />
    </div>

    <div class="flex flex-col gap-0 w-full w-[80%] justify-start">
      <div class="flex flex-row justify-start gap-4 max-w-[90%] items-center">
        <span class="text-sm uppercase" @click="detailTiket(tiketData?.customerNo)">{{ tiketData?.customerName }}</span>
        <span class="py-1 px-3 border rounded-xs text-xs" 
          :class="{'bg-[#FFFCA1] text-black': tiketData?.visitStatus === 'TODO', 'bg-[#90E0EF]': tiketData?.visitStatus === 'INPROGRESS', 'bg-[#E5F5E0]': tiketData?.visitStatus === 'FINISH'}"
          >{{ tiketData?.visitStatus }}</span>
      </div>
      <span class="text-xs text-gray-400">{{ tiketData?.customerNo }}</span>
      <div class="flex flex-col gap-2 text-xs text-gray-400">
        <span class="flex items-center gap-1" v-if="tiketData?.visitStatus !== 'TODO'"><ArrowDownCircleIcon class="h-4 w-4 text-green-500" /> {{ tiketData?.visitCheckIn ? useString.setDateTimeFormat(new Date(tiketData?.visitCheckIn)) : '-' }}</span>
        <span class="flex items-center gap-1" v-if="tiketData?.visitStatus !== 'TODO'"><ArrowUpCircleIcon class="h-4 w-4 text-red-500" /> {{ tiketData?.visitCheckOut ? useString.setDateTimeFormat(new Date(tiketData?.visitCheckOut)) : '-' }}</span>
        
        <span class="truncate max-w-[90%]">{{ location.calculateDistance({lat: tiketData?.lat, lng: tiketData?.lng}) }}, {{ tiketData?.alamat }}</span>
      </div>
      <div class="flex flex-row gap-4 justify-end items-center max-w-[90%] mt-2">
        <MapIcon class="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-500" @click="goingToMap(tiketData?.lat, tiketData?.lng)" />
        <MapPinIcon class="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-500" @click="goingToMap(tiketData?.lat, tiketData?.lng)"/>
        <BuildingStorefrontIcon class="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-500" @click="goingToMap(tiketData?.lat, tiketData?.lng)"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { MapIcon, MapPinIcon, BuildingStorefrontIcon, ArrowUpCircleIcon, ArrowDownCircleIcon } from '@heroicons/vue/24/outline'
import type { Tiket } from '~/types/user'
const useString = useUseString()
const { getLocationUrl } = useMaps()
const location = useUserLocation();
const emit = defineEmits(['detail'])

const props = defineProps({
  tiketData: {
    type: Object as Tiket,
    default: () => ({})
  }
})

const goingToMap = (lat: number, lang: number) => {
  window.open(getLocationUrl(lat, lang), '_blank')
}

const detailTiket = (id: string) => {
  emit('detail', id)
}


</script>

<style>

</style>