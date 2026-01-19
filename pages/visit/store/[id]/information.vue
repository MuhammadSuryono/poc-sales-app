<template>
  <div>
    <CardNavbarBack title="Detail Toko" />
    <div class="px-5">
      <span class="text-md">Informasi Pelanggan</span>
      <div class="flex flex-row gap-2 text-sm">
        <div class="w-[50%] flex flex-col gap-1">
          <div class="flex flex-col mt-4">
            <span class="font-semibold ">Customer No.</span>
            <span class="">{{ detailTiket?.customerNo }}</span>
          </div>
          <div class="flex flex-col mt-4">
            <span class="font-semibold ">No. KTP/NPWP</span>
            <span class="">{{ detailTiket?.identityNumber ?? '-' }}</span>
          </div>
          <div class="flex flex-col mt-4">
            <span class="font-semibold ">Customer Name</span>
            <span class="">{{ detailTiket?.customerName ?? '-' }}</span>
          </div>
          <div class="flex flex-col mt-4">
            <span class="font-semibold ">Customer Phone</span>
            <span class="">{{ detailTiket?.customerPhone ?? '-' }}</span>
          </div>
          <div class="flex flex-col mt-4">
            <span class="font-semibold ">Badan Usaha</span>
            <span class="">{{ detailTiket?.badanUsaha ?? '-' }}</span>
          </div>
          <div class="flex flex-col mt-4">
            <span class="font-semibold ">Alamat 1</span>
            <span class="">{{ detailTiket?.alamat ?? '-' }}</span>
          </div>
          <div class="flex flex-col mt-4">
            <span class="font-semibold ">Alamat 2</span>
            <span class="">{{ detailTiket?.alamat2 ?? '-' }}</span>
          </div>
        </div>
        <div class="w-[50%] flex flex-col gap-1">
          <div class="flex flex-col mt-4">
            <span class="font-semibold ">Nama Penjamin</span>
            <span class="">-</span>
          </div>
          <div class="flex flex-col mt-4">
            <span class="font-semibold ">Telepon Penjamin</span>
            <span class="">-</span>
          </div>
          <div class="flex flex-col mt-4">
            <span class="font-semibold ">Balance</span>
            <span class="hover:cursor-pointer hover:underline hover:text-blue-500">{{ useString.setNumberFormat(detailTiket?.balance ?? 0) }}</span>
          </div>
          <div class="flex flex-col mt-4">
            <span class="font-semibold ">Status</span>
            <span class="font-semibold" :class="{'text-red-700': detailTiket?.status === 'MACET', 'text-success': detailTiket?.status === 'LANCAR'}">{{ detailTiket?.status }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '~/stores/user'

const useString = useUseString()
const route = useRoute()
const customerId = route?.params?.id as string
const useStore = useUserStore()
const detailTiket = computed(() => {
  return useStore?.getAllTiketUser()?.find(t => t.customerNo === customerId)
})

</script>

<style>

</style>