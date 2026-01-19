<template>
  <div class="w-full flex flex-col bg-primary">
    <CardNavbarBack title="Daftar Kunjungan" />
    <client-only>
      <Maps :lat="myLocation.lat" :lng="myLocation.lng" />
    </client-only>

    <div class="px-3">
      <div class="mt-3 flex flex-row gap-3 bg-gray-100 w-full rounded-sm p-2 box-shadow-full border items-start w-full">
        <BuildingStorefrontIcon class="w-8 h-8 text-gray-400" />
        <div class="flex flex-col text-sm w-full">
          <div class="flex flex-row justify-between items-center">
            <div class="flex flex-col gap-1">              
              <span class="text-gray-600">Kunjungan Hari Ini</span>
              <span class="text-gray-800"><span class="font-semibold">{{ allTiketFinish?.length ?? 0 }}</span> / {{ allTiket?.length ?? 0 }} Toko</span>
            </div>
            <div class="flex flex-col gap-1">              
              <span class="text-gray-600">Belum Dikunjungi</span>
              <span class="text-gray-800"><span class="font-semibold">{{ allTiketTodo?.length ?? 0 }}</span> Toko</span>
            </div>
          </div>
          <div class="h-2 bg-gray-200 rounded-full mt-2 w-full overflow-hidden mb-3">
            <div
              class="h-full bg-primary rounded-full transition-all duration-300"
              :style="{ width: `${(allTiketFinish?.length ?? 0) / (allTiket?.length || 1) * 100}%` }"
            ></div>
          </div>
          <span class="text-sm text-gray-600">Dalam kunjungan: <span class="font-semibold">{{ allTiketInProgress?.length ?? 0 }}</span> Toko</span>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-3 bg-white mt-10 rounded-t-xl">
      <div class="flex flex-row gap-2 mt-3 max-w-[400px] overflow-x-auto py-3 px-3">
        <div class="relative inline-block whitespace-nowrap" @click="setActiveFilter('all')">
          <span class="inline-block text-gray-800 px-3 py-1 rounded-md text-sm  border" :class="{ 'bg-gray-100': activeFilter === 'all' }">
            Semua
          </span>
          <span
            class="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full px-1.5 h-4 flex items-center justify-center min-w-[1rem] shadow"
          >
            {{ allTiket?.length ?? 0 }}
          </span>
        </div>
        <div class="relative inline-block" @click="setActiveFilter('todo')">
          <span class="inline-block text-gray-800 px-3 py-1 rounded-md text-sm border"
            :class="{ 'bg-gray-100': activeFilter === 'todo' }"
          >
            Todo
          </span>
          <span
            class="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full px-1.5 h-4 flex items-center justify-center min-w-[1rem] shadow"
          >
            {{ allTiketTodo?.length ?? 0 }}
          </span>
        </div>
        <div class="relative inline-block" @click="setActiveFilter('inprogress')">
          <span class="inline-block text-gray-800 px-3 py-1 rounded-md text-sm border"
            :class="{ 'bg-gray-100': activeFilter === 'inprogress' }"
          >
            In Progress
          </span>
          <span
            class="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full px-1.5 h-4 flex items-center justify-center min-w-[1rem] shadow"
          >
            {{ allTiketInProgress?.length ?? 0 }}
          </span>
        </div>
        <div class="relative inline-block" @click="setActiveFilter('finish')">
          <span class="inline-block text-gray-800 px-3 py-1 rounded-md text-sm border"
            :class="{ 'bg-gray-100': activeFilter === 'finish' }"
          >
            Selesai
          </span>
          <span
            class="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full px-1.5 h-4 flex items-center justify-center min-w-[1rem] shadow"
          >
            {{ allTiketFinish?.length ?? 0 }}
          </span>
        </div>
      </div>

      <div class="flex flex-col px-3 pb-5">
        <card-customer-incoming
          @detail="navigateTo(`/visit/store/${item.customerNo}`)"
          v-for="(item, i) in dataTiket"
          :key="i"
          :tiketData="item"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { CardNavbarBack } from '#components';
import { useLocation } from '~/stores/location';
import { BuildingStorefrontIcon } from '@heroicons/vue/24/outline'
import { useUserStore } from '~/stores/user';
import type { Tiket } from '~/types/user';
const locationStore = useLocation()
const myLocation = computed(() => locationStore.myLocation)
const allTiket = computed((): Tiket[] => useUserStore().getAllTiketUser())
const allTiketTodo = computed((): Tiket[] => allTiket.value.filter(tiket => tiket.visitStatus === 'TODO'))
const allTiketInProgress = computed((): Tiket[] => allTiket.value.filter(tiket => tiket.visitStatus === 'INPROGRESS'))
const allTiketFinish = computed((): Tiket[] => allTiket.value.filter(tiket => tiket.visitStatus === 'FINISH'))
const activeFilter = ref<string>('all')
const dataTiket = ref<Tiket[]>([])

const setTiket = (): Tiket[] => {
  switch (activeFilter.value) {
    case 'all':
      return allTiket.value
    case 'todo':
      return allTiketTodo.value
    case 'inprogress':
      return allTiketInProgress.value
    case 'finish':
      return allTiketFinish.value
    default:
      return allTiket.value
  }
}

const setActiveFilter = (filter: string) => {
  activeFilter.value = filter
  dataTiket.value = setTiket()
}

definePageMeta({
  title: 'Daftar Kunjungan',
  layout: 'detail'
})

onMounted(() => {
  dataTiket.value = setTiket()
})

</script>

<style>

</style>