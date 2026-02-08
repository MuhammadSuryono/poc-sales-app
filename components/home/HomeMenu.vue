<template>
  <div class="menu-container">
    <div class="menu-grid">
      <!-- Item: Daftar Kunjungan -->
      <div class="menu-item group" @click="goTo('/visit/list')">
        <div class="icon-box bg-emerald-50 group-hover:bg-emerald-100 transition-colors">
          <CalendarDateRangeIcon class="icon-size text-emerald-600" />
        </div>
        <span class="menu-text">Kunjungan</span>
      </div>

      <!-- Item: Daftar Toko -->
      <!-- <div class="menu-item group">
        <div class="icon-box bg-orange-50 group-hover:bg-orange-100 transition-colors">
          <BuildingStorefrontIcon class="icon-size text-orange-600" />
        </div>
        <span class="menu-text">Daftar Toko</span>
      </div> -->

      <!-- Item: Tracking Order -->
      <!-- <div class="menu-item group" v-if="user?.role === 'SALES'">
        <div class="icon-box bg-purple-50 group-hover:bg-purple-100 transition-colors">
          <ShoppingBagIcon class="icon-size text-purple-600" />
        </div>
        <span class="menu-text">Tracking</span>
      </div> -->

      <!-- Item: Daftar Pembayaran -->
      <!-- <div class="menu-item group">
        <div class="icon-box bg-rose-50 group-hover:bg-rose-100 transition-colors">
          <ClipboardDocumentCheckIcon class="icon-size text-rose-600" />
        </div>
        <span class="menu-text">Payment</span>
      </div> -->

      <!-- Item: Reimbursement -->
      <div class="menu-item group" v-if="user?.role === 'SALES'" @click="goTo('/reimbursement')">
        <div class="icon-box bg-green-50 group-hover:bg-green-100 transition-colors">
          <CurrencyDollarIcon class="icon-size text-green-600" />
        </div>
        <span class="menu-text">Reimbursement</span>
      </div>

      <!-- Item: New Contact -->
      <div class="menu-item group" @click="goTo('/noo')">
        <div class="icon-box bg-blue-50 group-hover:bg-blue-100 transition-colors">
          <UserPlusIcon class="icon-size text-blue-600" />
        </div>
        <span class="menu-text">New Contact</span>
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
  CurrencyDollarIcon,
} from '@heroicons/vue/24/outline'
import { useUserStore } from '~/stores/user'
import type { User } from '~/types/user';

const goTo = (path : string) => {
  navigateTo(path)
}

const userStore = useUserStore();
const user = computed(() => userStore?.user as User)
</script>

<style scoped>
@reference "../../assets/css/main.css";

.menu-container {
  @apply bg-white rounded-3xl p-5 shadow-sm border border-gray-100/30;
}

.menu-grid {
  @apply grid grid-cols-4 gap-y-6 gap-x-2;
}

.menu-item {
  @apply flex flex-col items-center gap-2 cursor-pointer transition-all duration-200 active:scale-90;
}

.icon-box {
  @apply w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm border border-white;
}

.icon-size {
  @apply w-6 h-6;
}

.menu-text {
  @apply text-[10px] font-bold text-gray-500 text-center leading-tight tracking-tight uppercase;
  max-width: 64px;
}
</style>