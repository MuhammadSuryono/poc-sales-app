<template>
  <div id="map" class="h-[250px] w-full rounded-b-xl border-b"></div>
</template>

<script lang="ts" setup>
import L from 'leaflet'
const props = defineProps({
  lat: {
    type: Number,
    default: 0
  },
  lng: {
    type: Number,
    default: 0
  }
})


const setMapLeaflet = () => {
  const map = L.map('map').setView([props.lat, props.lng], 15)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map)

  L.marker([props.lat, props.lng])
    .addTo(map)
    .openPopup()
}

onMounted(() => {
  setMapLeaflet()
})

</script>

<style>

</style>