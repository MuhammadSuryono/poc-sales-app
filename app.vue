<template>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <ScreenLoading :title="titleLoading" v-if="isLoading" />
    <NuxtPage/>
  </NuxtLayout>
</template>
<script setup lang="ts">
import 'leaflet/dist/leaflet.css'
import { useLoadingState } from './stores/loading';

const useLoading = useLoadingState()
const isLoading = computed(() => useLoading?.isLoading)
const titleLoading = computed(() => useLoading?.titleLoading)

if (!navigator.geolocation) {
  console.log("Geolocation tidak didukung di browser ini.")
} else {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      console.log(pos)
    },
    (err) => {
      console.log(err.message || 'Throw error')
    }
  )
}

</script>