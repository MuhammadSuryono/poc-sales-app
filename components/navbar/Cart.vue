<template>
  <div class="relative inline-block" @click="goToCartPage">
    <span class="inline-block text-gray-800 px-3 py-1 rounded-md text-sm"
    >
      <ShoppingCartIcon class="h-6 w-6 text-gray-700" />
    </span>
    <span
      class="absolute -top-2 -right-0 bg-red-500 text-white text-[10px] rounded-full px-1.5 h-4 flex items-center justify-center min-w-[1rem] shadow"
    >
      {{ totalCart }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import { ShoppingCartIcon } from '@heroicons/vue/24/outline'
import { useOrderStore } from '~/stores/order';

const useOrder = useOrderStore()
const route = useRoute()
const totalCart = computed(() => useOrder.getTotalCartCustomer(route?.params?.id as string))

const goToCartPage = () => {
  navigateTo(`/visit/store/${route?.params?.id}/cart`)
}

</script>

<style>

</style>