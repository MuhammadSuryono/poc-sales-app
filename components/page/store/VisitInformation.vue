<template>
  <div class="border w-full rounded-lg flex flex-col gap-2 p-3 box-shadow-full">
    <div class="flex flex-row gap-1 items-center border-b pb-2">
      <MapPinIcon class="h-5 w-5 text-danger" />
      <span class="text-sm text-wrap">Anda berada {{ distance }} dari lokasi</span>
    </div>
    <span class="text-xs text-gray-500" v-if="itemTiket?.visitStatus === 'FINISH' || itemTiket?.visitStatus === 'TODO'">Kunjungan Terakhir: {{ itemTiket?.visitDate ? useString.setDateTimeFormat(new Date(itemTiket?.visitDate)) : '-' }}</span>
    <div class="flex flex-row justify-between" v-if="itemTiket?.visitStatus === 'INPROGRESS'">
      <span class="text-sm text-gray-500">Check in: <br/>{{ itemTiket?.visitCheckIn ? useString.setDateTimeFormat(new Date(itemTiket?.visitCheckIn)) : '-' }}</span>
      <span class="text-sm text-gray-500">Check out: <br/>{{ itemTiket?.visitCheckOut ? useString.setDateTimeFormat(new Date(itemTiket?.visitCheckOut)) : '-' }}</span>
    </div>
    <div class="flex flex-row gap-2 items-center justify-end" v-if="itemTiket?.visitStatus !== 'FINISH'">
      <ButtonSecondary text="Input Kunjungan" size="md"  class="w-full text-sm font-normal bg-[#74C476] text-white" v-if="itemTiket?.visitStatus === 'INPROGRESS'" @click="inputDataVisit"/>
      <ButtonSuccess text="Check In" size="md" class="w-full text-sm font-normal" v-if="itemTiket?.visitStatus === 'TODO'" @click="checkIn"/>
      <ButtonDanger text="Check Out" size="md" class="w-full text-sm font-normal" v-if="itemTiket?.visitStatus === 'INPROGRESS'" @click="checkOut" :disabled="!insideRadius || totalCart > 0" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { MapPinIcon } from '@heroicons/vue/24/outline'
import { useLoadingState } from '~/stores/loading';
import { useOrderStore } from '~/stores/order';
import { useUserStore } from '~/stores/user';
import type { Tiket } from '~/types/user';

interface LocalProps {
  itemTiket: Tiket
}
const props = withDefaults(defineProps<LocalProps>(), {
  itemTiket: {} as Tiket
})
const emit = defineEmits(['onCheckin','onCheckout','inputVisit'])

const useString = useUseString();
const useStore = useUserStore()
const userLocation = useUserLocation()
const useLoading = useLoadingState();
const useOrder = useOrderStore()

const route = useRoute()
const totalCart = computed(() => useOrder.getTotalCartCustomer(route?.params?.id as string))
const distance = computed(() => userLocation.calculateDistance({
  lat: props?.itemTiket?.lat,
  lng: props?.itemTiket?.lng
}))
const insideRadius = computed((): boolean => props?.itemTiket ? userLocation.isInsideRadius({
  lat: props?.itemTiket?.lat,
  lng: props?.itemTiket?.lng
}, useStore.tollerance) : false)

const checkIn = async () => {
  useLoading.setLoading('Mohon tunggu...')
  await userLocation.getLocation()
  emit('onCheckin')
}

const checkOut = () => {
  emit('onCheckout')
}

const inputDataVisit = () => {
  emit('inputVisit')
}


</script>

<style>

</style>