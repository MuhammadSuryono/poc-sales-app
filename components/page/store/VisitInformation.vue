<template>
  <div class="transparent p-0 shadow-sm">
    <!-- Riwayat & Info -->
    <!-- <div class="border-gray-50 italic">
      <div v-if="itemTiket?.visitStatus === 'INPROGRESS'" class="flex justify-between w-full">
        <div class="flex flex-col">
          <span class="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none mb-2">Waktu Check-In</span>
          <span class="text-xs font-black text-gray-600 block tracking-tight">
            {{ itemTiket?.visitCheckIn ? useString.setDateTimeFormat(new Date(itemTiket.visitCheckIn)) : 'Baru saja' }}
          </span>
        </div>
        <div class="flex flex-col items-end">
          <span class="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none mb-2 text-right">Tujuan Kunjungan</span>
          <span class="text-xs font-black text-java-teal block uppercase tracking-wider">Update Stok</span>
        </div>
      </div>
      <div v-else class="flex flex-col">
        <span class="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none mb-2">Kunjungan Terakhir</span>
        <span class="text-xs font-black text-gray-600 block tracking-tight">
          {{ itemTiket?.visitDate ? useString.setDateTimeFormat(new Date(itemTiket.visitDate)) : 'Belum ada riwayat' }}
        </span>
      </div>
    </div> -->

    <!-- Area Aksi -->
    <div class="flex flex-col">
      <div v-if="itemTiket?.visit_status === 'TODO'">
        <button 
          @click="checkIn" 
          class="h-16 w-full rounded-t-[20px] flex items-center justify-between px-7 font-black text-[11px] uppercase tracking-[0.2em] bg-java-green text-java-dark shadow-xl shadow-java-green/20 border border-java-green/30 active:scale-[0.98] transition-all"
        >
          <span>Check In</span>
          <ArrowRightIcon class="w-6 h-6" />
        </button>
      </div>

      <div v-if="itemTiket?.visit_status === 'INPROGRESS'" class="flex items-center gap-3">
        <button
          @click="checkOut" 
          :disabled="!insideRadius || totalCart > 0"
          class="h-16 flex-1 rounded-t-2xl flex items-center justify-between px-7 font-black text-[11px] 
          uppercase tracking-[0.2em] border transition-all active:scale-[0.98]"
          :class="(!insideRadius || totalCart > 0) ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-red-50 text-red-600 border-red-200 shadow-xl shadow-red-500/10'"
        >
          <span>Selesai</span>
          <CheckIcon class="w-6 h-6" />
        </button>
        
        <button 
          @click="inputDataVisit" 
          class="h-16 w-16 rounded-full flex items-center justify-center font-black text-[11px] 
          uppercase tracking-[0.2em] bg-java-teal text-white shadow-xl 
          shadow-java-teal/20 border border-java-teal/30 active:scale-[0.98] 
          transition-all"
        >
          <PencilSquareIcon class="w-6 h-6 opacity-70" />
        </button>
      </div>
      
      <div v-if="itemTiket?.visit_status === 'FINISH'" class="flex items-center gap-4 py-5 justify-center bg-gray-50/50 rounded-2xl border border-gray-100">
        <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
          <CheckIcon class="w-6 h-6 text-java-green" />
        </div>
        <span class="text-xs font-black text-java-teal uppercase tracking-[0.2em]">Aktivitas Selesai</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { MapPinIcon, ArrowRightIcon, PencilSquareIcon, CheckIcon } from '@heroicons/vue/24/outline'
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
const distance = computed(() => {
  const lat = props?.itemTiket?.lat
  const lng = props?.itemTiket?.lng
  if (typeof lat !== 'number' || typeof lng !== 'number') return '—'
  return userLocation.calculateDistance({ lat, lng }) ?? 0
})
const insideRadius = computed((): boolean => {
  const lat = props?.itemTiket?.lat
  const lng = props?.itemTiket?.lng
  if (typeof lat !== 'number' || typeof lng !== 'number') return false
  return userLocation.isInsideRadius({ lat, lng }, useStore.tolerance)
})

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

<style scoped>
@reference "../../../assets/css/main.css";

/* Components specific mobile adjustments if any */
</style>
