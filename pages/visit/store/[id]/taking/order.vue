<template>
  <div div class="">
    <CardNavbarBack title="Taking Order">
      <template #right>
        <NavbarCart />
      </template>
    </CardNavbarBack>
    <div class="px-4 pt-3 pb-1">
      <!-- Input Pencarian -->
      <FormInput v-model="query" placeholder="Cari produk">
        <template #icon>
          <MagnifyingGlassIcon class="w-5 h-5 text-gray-400" />
        </template>
      </FormInput>

      <!-- List Produk -->
      <div class="flex flex-col mt-3 gap-3 h-[calc(100vh-14rem)] overflow-auto pr-2 pb-24">
        <div
          v-for="(p, i) in filteredProducts"
          :key="i"
          @click="onSelectItem(p)"
          class="flex items-start gap-4 bg-white rounded-[20px] border border-gray-100 p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition cursor-pointer group"
        >
          <!-- Gambar Produk -->
          <NuxtImg
            :src="p.image"
            class="w-20 h-20 object-cover rounded-2xl border group-hover:opacity-95 transition"
            alt="Product"
          />

          <!-- Detail Produk -->
          <div class="flex flex-col justify-between w-full text-sm">
            <!-- Nama & Kode -->
            <div>
              <span class="px-2 py-0.5 rounded-lg bg-gray-100 text-[10px] text-gray-500 font-black uppercase tracking-widest">{{ p.code }}</span>
              <p class="text-base font-semibold text-gray-800 leading-tight mt-1">{{ p.name }}</p>
            </div>

            <!-- Stok -->
            <p class="text-gray-500 text-xs mt-1">Stok: {{ p.stok }}</p>

            <!-- Harga & Diskon -->
            <div class="flex items-center gap-2 mt-2">
              <!-- Harga Sebelum Diskon -->
              <span v-if="p.discount > 0" class="text-xs text-gray-400 line-through">
                {{ useString.setNumberFormat(p.price) }}
              </span>

              <!-- Badge Diskon -->
              <span
                v-if="p.discount > 0"
                class="text-xs bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded"
              >
                -{{ p.discount }}%
              </span>
            </div>

            <!-- Harga Setelah Diskon -->
            <span class="text-lg font-black text-java-teal">
              {{ useString.setNumberFormat(p.price * (1 - p.discount / 100)) }}
            </span>
          </div>
        </div>
      </div>

    </div>
    <div class="fixed inset-x-0 bottom-0 z-40 safe-area-bottom">
      <div class="bg-white border-t border-gray-100 shadow-2xl w-full flex flex-row h-full p-3 items-center justify-between">
      <span class="font-bold text-xl">{{ useString.setNumberFormat(totalPriceInCart) }}</span>
      <ButtonDanger text="Checkout" @click="goToCartPage" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { useNotificationStore } from '~/stores/notification';
import { useOrderStore } from '~/stores/order';
import { useProductStore } from '~/stores/product';
import type { Product } from '~/types/product';
const notifStore = useNotificationStore()
const useOrder = useOrderStore()
const useProducts = useProductStore()
const products = computed(() => useProducts?.products || [])
const route = useRoute()
const totalPriceInCart = computed(() => useOrder?.getTotalPriceCart(route?.params?.id as string))
const useString = useUseString()
const query = ref<string>('')
const filteredProducts = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return products.value
  return products.value.filter(p => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q))
})

const onSelectItem = (product: Product) => {
  const customerNo = route?.params?.id
  useOrder.addToCart(customerNo as string, product)
  notifStore.toggle('Produk ditambahkan ke Cart')
}

const goToCartPage = () => {
  navigateTo(`/visit/store/${route?.params?.id}/cart`)
}

await useProducts.fetchAllProducts()

</script>

<style>

</style>
