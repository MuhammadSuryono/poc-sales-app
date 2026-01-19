<template>
  <div div class="">
    <CardNavbarBack title="Taking Order">
      <template #right>
        <NavbarCart />
      </template>
    </CardNavbarBack>
    <div class="px-4 pt-3 pb-1">
      <!-- Input Pencarian -->
      <FormInput placeholder="Cari produk">
        <template #icon>
          <MagnifyingGlassIcon class="w-5 h-5 text-gray-400" />
        </template>
      </FormInput>

      <!-- List Produk -->
      <div class="flex flex-col mt-3 gap-3 h-[calc(100vh-14rem)] overflow-auto pr-2">
        <div
          v-for="(p, i) in products"
          :key="i"
          @click="onSelectItem(p)"
          class="flex items-start gap-4 bg-white rounded-lg border p-4 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <!-- Gambar Produk -->
          <NuxtImg
            :src="p.Image"
            class="w-24 h-24 object-cover rounded-md border"
            alt="Product"
          />

          <!-- Detail Produk -->
          <div class="flex flex-col justify-between w-full text-sm">
            <!-- Nama & Kode -->
            <div>
              <p class="text-xs text-gray-400 mb-1">{{ p.Code }}</p>
              <p class="text-base font-semibold text-gray-800 leading-tight">{{ p.Name }}</p>
            </div>

            <!-- Stok -->
            <p class="text-gray-500 text-xs mt-1">Stok: {{ p.Stok }}</p>

            <!-- Harga & Diskon -->
            <div class="flex items-center gap-2 mt-2">
              <!-- Harga Sebelum Diskon -->
              <span v-if="p.Discount > 0" class="text-xs text-gray-400 line-through">
                {{ useString.setNumberFormat(p.Price) }}
              </span>

              <!-- Badge Diskon -->
              <span
                v-if="p.Discount > 0"
                class="text-xs bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded"
              >
                -{{ p.Discount }}%
              </span>
            </div>

            <!-- Harga Setelah Diskon -->
            <span class="text-sm font-semibold text-primary">
              {{ useString.setNumberFormat(p.Price * (1 - p.Discount / 100)) }}
            </span>
          </div>
        </div>
      </div>

    </div>
    <div class="bg-white border-t box-shadow-full w-full flex flex-row rounded 2xl h-full p-3 items-center justify-between">
      <span class="font-bold text-xl">{{ useString.setNumberFormat(totalPriceInCart) }}</span>
      <ButtonDanger text="Checkout" @click="goToCartPage" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { useNotificationStore } from '~/stores/notification';
import { useOrderStore } from '~/stores/order';
import type { Product } from '~/types/product';
const notifStore = useNotificationStore()
const useOrder = useOrderStore()
const products = computed(() => useOrder?.products)
const route = useRoute()
const totalPriceInCart = computed(() => useOrder?.getTotalPriceCart(route?.params?.id as string))
const useString = useUseString()

const onSelectItem = (product: Product) => {
  const customerNo = route?.params?.id
  useOrder.addToCart(customerNo as string, product)
  notifStore.toggle('Produk ditambahkan ke Cart')
}

const goToCartPage = () => {
  navigateTo(`/visit/store/${route?.params?.id}/cart`)
}

</script>

<style>

</style>