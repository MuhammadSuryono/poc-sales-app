<script setup lang="ts">

import { useSidebarStore } from '~/stores/sidebar'
const sidebarStore = useSidebarStore()
const { getLocation } = useUserLocation()
const isMobile = ref(false)

function handleResize() {
  isMobile.value = window.matchMedia('(max-width: 1024px)').matches
  sidebarStore.width = isMobile.value ? 0 : 256 // default width when not mobile
}

onMounted(async () => {
  handleResize()
  window.addEventListener('resize', handleResize)
  await getLocation()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
<template>
  <div class="flex flex-col h-screen">
    <!-- Navbar (fixed di atas) -->
    <Navbar />

    <!-- Wrapper Sidebar + Content -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <Sidebar class="hidden lg:block" />

      <!-- Content -->
      <main class="flex-1 overflow-y-auto bg-white transition-all duration-300"
            :style="{ marginLeft: `${sidebarStore.width}px`, marginTop: `75px` }">
        <slot />
      </main>
    </div>

    <!-- Notification -->
    <NotificationSnackBar />
  </div>
</template>

<style scoped>

</style>