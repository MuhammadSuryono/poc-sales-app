<template>
  <div 
    class="customer-row group"
    @click="detailTiket(tiketData.customer_no)"
  >
    <!-- Left: Store Icon -->
    <div class="flex-shrink-0">
      <div class="w-12 h-12 rounded-2xl bg-java-teal/5 flex items-center justify-center group-hover:bg-java-teal group-hover:text-white transition-all duration-300">
        <BuildingStorefrontIcon class="h-6 w-6 text-java-teal group-hover:text-white transition-colors" />
      </div>
    </div>

    <!-- Middle: Info -->
    <div class="flex-1 min-w-0 flex flex-col justify-center">
      <div class="flex items-center justify-between mb-0.5">
        <h3 class="text-sm font-bold text-gray-800 truncate uppercase tracking-tight">
          {{ tiketData.customer_name }}
        </h3>
        <!-- <span 
          class="status-pill"
          :class="{
            'pill-todo': tiketData.visitStatus === 'TODO',
            'pill-inprogress': tiketData.visitStatus === 'INPROGRESS',
            'pill-finish': tiketData.visitStatus === 'FINISH'
          }"
        >
          {{ tiketData.visitStatus }}
        </span> -->
      </div>
      
      <div class="flex items-center gap-2 text-[10px] font-bold">
        <span class="text-gray-400 uppercase leading-none">{{ tiketData.customer_no }}</span>
        <span class="w-1 h-1 rounded-full bg-gray-200"></span>
        <span class="text-java-green leading-none">{{ location.calculateDistance({lat: tiketData.lat, lng: tiketData.lng}) }}</span>
      </div>

      <p class="text-[11px] text-gray-400 line-clamp-1 mt-1 font-medium italic">
        {{ tiketData.alamat }}
      </p>
    </div>

    <!-- Right: Arrow -->
    <div class="flex-shrink-0 self-center pl-2">
      <ChevronRightIcon class="h-5 w-5 text-gray-300 group-hover:text-java-teal transition-colors" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { 
  BuildingStorefrontIcon, 
  ChevronRightIcon
} from '@heroicons/vue/24/outline'
import type { Tiket } from '~/types/user'
import type { PropType } from 'vue'

const location = useUserLocation();
const emit = defineEmits(['detail'])

const props = defineProps({
  tiketData: {
    type: Object as PropType<Tiket>,
    required: true
  }
})

const detailTiket = (id: string) => {
  emit('detail', id)
}
</script>

<style scoped>
@reference "../../assets/css/main.css";

.customer-row {
  @apply flex items-stretch gap-4 p-4 bg-white border border-gray-100 rounded-[24px] hover:shadow-lg hover:border-java-teal/20 transition-all duration-300 cursor-pointer;
}

.status-pill {
  @apply px-2 py-0.5 rounded-lg text-[8px] font-extrabold uppercase tracking-widest border border-transparent;
}

.pill-todo {
  @apply bg-yellow-50 text-yellow-600 border-yellow-100/50;
}

.pill-inprogress {
  @apply bg-blue-50 text-blue-600 border-blue-100/50;
}

.pill-finish {
  @apply bg-green-50 text-green-600 border-green-100/50;
}
</style>