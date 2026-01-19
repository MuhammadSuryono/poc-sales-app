<template>
  <div>
    <CardNavbarBack title="Cart">
      <template #right>
        <NavbarCart />
      </template>
    </CardNavbarBack>
    <div class="flex flex-col mt-3 gap-4 h-[calc(100vh-10rem)] overflow-auto pr-2">
      <div
        v-for="(p, i) in carts"
        :key="i"
        class="flex items-center gap-4 bg-white rounded-xl border p-4 shadow hover:shadow-md transition cursor-pointer group"
      >
        <!-- Gambar Produk -->
        <NuxtImg
          :src="p.Image"
          class="w-20 h-20 object-cover rounded-md border"
          alt="Product"
        />

        <!-- Detail Produk -->
        <div class="flex flex-col justify-between w-full h-full">
          <!-- Info Produk -->
          <div>
            <p class="text-xs text-gray-400">{{ p.Code }}</p>
            <p class="text-base font-semibold text-gray-800">{{ p.Name }}</p>
          </div>

          <!-- Harga & Aksi -->
          <div class="flex items-center justify-between mt-3">
            <!-- Harga -->
            <div class="flex items-center gap-2">
              <div class="flex flex-col">
                <span
                  v-if="p.Discount > 0"
                  class="text-xs text-gray-400 line-through"
                >
                  {{ useString.setNumberFormat(p.Price) }}
                </span>
                <span class="text-sm font-semibold text-primary leading-tight">
                  {{
                    useString.setNumberFormat(
                      p.Price * (1 - p.Discount / 100)
                    )
                  }}
                </span>
              </div>

              <!-- Diskon Badge -->
              <span
                v-if="p.Discount > 0"
                class="text-xs bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded"
              >
                -{{ p.Discount }}%
              </span>

              <!-- Input Qty -->
              <input
                type="number"
                :value="p.Quantity"
                class="w-16 text-center border rounded-md text-sm py-1 px-2 focus:outline-none focus:ring focus:border-primary"
                @input="onQuantityChange($event, p)"
                min="1"
              />
            </div>

            <!-- Tombol Hapus -->
            <button
              class="text-red-500 text-sm hover:underline"
              @click.stop="onRemoveProduct(p)"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>


    <div class="bg-white border-t box-shadow-full w-full flex flex-row rounded 2xl h-full p-3 items-center justify-between">
      <span class="font-bold text-xl">{{ useString.setNumberFormat(totalPriceInCart) }}</span>
      <ButtonDanger text="Checkout" @click="showModalCofirmation = true" />
    </div>
    
    <PopUpModal :show="showModalCofirmation">
      <template #header>
        <span>Konfirmasi Transaksi</span>
      </template>
      <div class="p-5 flex flex-col gap-4 text-sm">
        <!-- Ringkasan -->
        <div class="flex justify-between items-center">
          <span class="text-gray-600">Total Quantity</span>
          <span class="font-semibold text-gray-800">{{ totalQuantity }}</span>
        </div>

        <div class="flex justify-between items-center">
          <span class="text-gray-600">Total Pembelian</span>
          <span class="font-semibold text-primary">
            {{ useString.setNumberFormat(totalPriceInCart) }}
          </span>
        </div>

        <!-- Optional: Metode Pembayaran -->
        <div class="flex flex-col gap-1">
          <label class="text-gray-600 font-medium" for="paymentMethod">Metode Pembayaran</label>
          <select
            id="paymentMethod"
            v-model="selectedPayment"
            class="border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-primary"
          >
            <option value="TRANSFER">Transfer Bank</option>
            <option value="QRIS">QRIS</option>
            <option value="CASH">Tunai</option>
          </select>
        </div>

        <!-- Optional: Catatan -->
        <div class="flex flex-col gap-1">
          <label class="text-gray-600 font-medium" for="note">Catatan</label>
          <textarea
            id="note"
            v-model="note"
            rows="2"
            class="border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-primary resize-none"
            placeholder="Tulis catatan tambahan..."
          ></textarea>
        </div>

        <!-- Tombol Buat Order -->
      </div>
      <template #footer>
        <button
          class="mt-4 w-full bg-white text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 font-semibold transition"
          @click="showModalCofirmation = false"
        >
          Batal
        </button>
        <button
          class="mt-4 w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 font-semibold transition"
          @click="onCreateOrder"
        >
          Buat Order
        </button>
      </template>
    </PopUpModal>
  </div>
</template>

<script lang="ts" setup>
import { useLoadingState } from '~/stores/loading';
import { useNotificationStore } from '~/stores/notification';
import { useOrderStore } from '~/stores/order';
import { useUserStore } from '~/stores/user';
import { type PaymentType, type CartProduct } from '~/types/product';
import type { User } from '~/types/user';

const useOrder = useOrderStore()
const route = useRoute()
const useUser = useUserStore()
const customerId = route?.params?.id as string
const useString = useUseString()
const carts = computed(() => useOrder?.getCartCustomerActive(customerId)?.Products ?? [])
const totalPriceInCart = computed(() => useOrder?.getTotalPriceCart(customerId))
const totalQuantity = computed(() => useOrder?.getTotalQuantity(customerId))
const selectedPayment = ref<PaymentType>("TRANSFER")
const note = ref("")
const useLoading = useLoadingState()
const useNotification = useNotificationStore()
const showModalCofirmation = ref<boolean>(false)

const onQuantityChange = (e: Event, product: CartProduct) => {
  const val = Number((e.target as HTMLInputElement).value)
  product.Quantity = val > 0 ? val : 1
  product.Total = product.Price * product.Quantity
}

const onRemoveProduct = (product: CartProduct) => {
  useOrder.$patch(state => {
    const cart = state.charts.find(c => c.CustomerNo === route?.params?.id && c.Status === 'ACTIVE')
    if (cart) {
      cart.Products = cart.Products.filter(p => p.Code !== product.Code)
    }
  })
}
const onCreateOrder = async () => {
  useLoading.setLoading('Mohon tunggu...')
  const user = useUser?.user as User
  useOrder.createOrder(customerId, selectedPayment.value, note.value)
  useUser.updateStatistic(user?.userId, totalPriceInCart.value)
  useOrder.$patch(state => {
    const cart = state.charts.find(c => c.CustomerNo === route?.params?.id && c.Status === 'ACTIVE')
    if (cart) {
      cart.Status = 'CHECKOUT'
    }
  })
  showModalCofirmation.value = false
  useLoading.disLoading()
  useNotification.toggle('Order berhasil dibuat')
  navigateTo(`/visit/store/${customerId}/history/order`)
}

</script>

<style>

</style>