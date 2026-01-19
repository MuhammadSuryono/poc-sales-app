<template>
  <div class="rounded-md bg-white p-2 items-center justify-center flex flex-col gap-5">
    <div class="flex flex-row justify-start gap-5 items-center">
      <div class="flex flex-col gap-1 items-center text-center" @click="goTo('/visit/list')">
        <div class="items-end justify-end shadow-full px-2 bg-[#E5F5E0] rounded-lg">
          <CalendarDateRangeIcon class="w-10 h-10 rounded-full text-primary mt-2" />
        </div>
        <span class="text-xs text-gray-400">Daftar Kunjungan</span>
      </div>
      <div class="flex flex-col gap-1 items-center text-center" @click="goTo('/noo')">
        <div class="items-end justify-end shadow-full px-2 bg-[#E5F5E0] rounded-lg">
          <UserPlusIcon class="w-10 h-10 rounded-full text-primary mt-2" />
        </div>
        <span class="text-xs text-gray-400">New Contact</span>
      </div>
      <div class="flex flex-col gap-1 items-center text-center">
        <div class="items-end justify-end shadow-full px-2 bg-[#E5F5E0] rounded-lg">
          <BuildingStorefrontIcon class="w-10 h-10 rounded-full text-primary mt-2" />
        </div>
        <span class="text-xs text-gray-400">Daftar Toko</span>
      </div>      
      <div class="flex flex-col gap-1 items-center text-center" v-if="user?.role === 'SALES'">
        <div class="items-end justify-end shadow-full px-2 bg-[#E5F5E0] rounded-lg">
          <ShoppingBagIcon class="w-10 h-10 rounded-full text-primary mt-2" />
        </div>
        <span class="text-xs text-gray-400">Tracking Order</span>
      </div>
      <div class="flex flex-col gap-1 items-center text-center">
        <div class="items-end justify-end shadow-full px-2 bg-[#E5F5E0] rounded-lg">
          <ClipboardDocumentCheckIcon class="w-10 h-10 rounded-full text-primary mt-2" />
        </div>
        <span class="text-xs text-gray-400">Dafar Pembayaran</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  CalendarDateRangeIcon,
  BuildingStorefrontIcon,
  ShoppingBagIcon,
  ClipboardDocumentCheckIcon,
  UserPlusIcon,
} from '@heroicons/vue/24/outline'
import { useUserStore } from '~/stores/user'
import type { User } from '~/types/user';

const goTo = (path : string) => {
  navigateTo(path)
}

const userStore = useUserStore();
const user = computed(() => userStore?.user as User)

</script>

<style>
.shadow-full {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>