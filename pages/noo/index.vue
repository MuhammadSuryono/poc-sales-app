<template>
  <div>
    <CardNavbarBack title="Daftar New Contact" />
    <div class="flex flex-col px-3 py-5">
      <div class="flex w-full justify-end mb-3">
        <ButtonPrimary text="Buat New Contact" @click="showModal = true"/>
      </div>
      <div class="bg-white w-full rounded-sm border box-shadow-full flex flex-col px-3 py-2" v-for="(n, i) in nooData" :key="i">
        <span class="font-semibold text-sm uppercase">{{ n.customerName }}</span>
        <span class="text-xs text-gray-400">Phone: {{ n.contact }}</span>
        <span class="text-xs text-gray-400 truncate max-w-[90%] hover:cursor-pointer hover:text-underline hover:text-blue-500" @click="openMap(n?.lat, n?.lng)">Alamat: {{ n.addres }}</span>
      </div>
    </div>
    <PopUpModal :show="showModal">
      <div class="flex flex-col gap-2 w-full">
        <FormInput label="Nama Toko" v-model="form.name" placeholder="Toko" />
        <FormInput label="Kontak" v-model="form.contact" placeholder="08xxx" />
        <div class="flex flex-row justify-between items-center w-full">
          <FormInput label="Alamat" v-model="form.address" placeholder="Jl.xxx" class="w-full" />
          <ButtonSecondary size="sm" text="Cari" class="mt-5" @click="searchAddress" />
        </div>

        <div class="flex flex-col">
          <span class="text-gray-700 text-sm text-wrap max-w-[90%] border py-1 px-2 hover:bg-gray-100 hover:cursor-pointer" @click="setLatLng(l?.geometry?.lat, l?.geometry?.lng)" v-for="(l,i) in listResponse">{{  l?.formatted ?? '-' }}</span>
        </div>
      </div>
      <template #footer>
        <ButtonSecondary size="sm" text="Batal" class="font-normal" @click="showModal = false" />
        <ButtonPrimary size="sm" text="Simpan" class="font-normal" @click="saveNoo" />
      </template>
    </PopUpModal>
    
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '~/stores/user';
import type { Noo } from '~/types/user';

const useUser = useUserStore()
const nooData = computed(() => useUser?.nooData ?? [])
const showModal = ref<boolean>(false)
const form = ref({
  name: '',
  contact: '',
  address: '',
  lat: null,
  lng: null
})

const listResponse = ref([])

const openMap = (lat: number, lng: number) => {
  navigateTo(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, {external: true, open: { target: '_blank'}})
}

const searchAddress = async () => {
  listResponse.value = []
  const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(form.value.address)}&key=5d9e352cca42475bb61e86aa5c6258fd&language=id&pretty=1`
    )
    const data = await response.json()
    if (data.total_results > 0) {
      listResponse.value = data?.results
    }
}

const setLatLng = (lat:number, lng: number) => {
  listResponse.value = []
  form.value = {
    ...form.value,
    lat: lat,
    lng: lng,
  }
}

const saveNoo = () => {
  const newNoo: Noo = {
    contact: form.value.contact,
    customerName: form.value.name,
    addres: form.value.address,
    lat: form.value.lat,
    lng: form.value.lng
  }

  useUser?.$patch(state => {
    state?.nooData?.push(newNoo)
  })

  showModal.value = false
  resetForm()
}

const resetForm = () => {
  form.value = {
    name: '',
    contact: '',
    address: '',
    lat: null,
    lng: null
  }
}

watch(
  () => showModal.value,
  (newVal: boolean, oldVal: boolean) => {
    if (newVal === true) {
      resetForm()
    }
  }
)

</script>

<style>

</style>