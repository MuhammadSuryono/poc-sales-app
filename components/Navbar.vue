<script setup lang="ts">
import AccountMenu from '~/components/AccountMenu.vue'
import BrandLogo from '~/components/brand/Logo.vue'
import { useNavbarStore } from '~/stores/navbar'
import type { NavbarType } from '~/types/navbar';
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '~/stores/user';
import type { User } from '~/types/user';

const useNavbar = useNavbarStore();
const navbarType = computed(() : NavbarType => useNavbar.header.type)
const route = useRoute()
const router = useRouter()
const useUser = useUserStore()
const user = computed(() => useUser?.user as User)

const goToBack = () => {
  if (Object.keys(route.query).length > 0) {
    router.replace({ path: route.path })
    console.log("route.query", route.query)
    useNavbar.setHeader('MAIN')
  }
}
watch(
  () => navbarType.value,
  (newVal) => {
    console.log("NavbarType:", newVal)
  }
)
</script>

<template>
  <!-- Main Navbar with Logo -->
  <header 
    class="flex justify-between items-center bg-java-dark border-b border-white/10 p-3 fixed top-0 left-0 right-0 z-50 safe-area-top transition-base" 
    :class="{'hidden lg:flex': navbarType === 'BACK', 'flex': navbarType === 'MAIN'}"
  >
    <NuxtLink to="/" class="flex items-center gap-3 hover:opacity-80 transition-base">
      <BrandLogo size="xs" />
    </NuxtLink>
    <div class="flex items-center gap-4">
      <AccountMenu />
    </div>
  </header>

  <!-- Back Navigation Navbar -->
  <header 
    class="flex justify-between items-center bg-java-dark border-b border-white/10 p-3 fixed top-0 left-0 right-0 z-50 safe-area-top transition-base text-white" 
    :class="{'flex lg:hidden': navbarType === 'BACK', 'hidden': navbarType === 'MAIN'}"
  >
    <div class="flex flex-row gap-4 justify-start items-center py-3">
      <button 
        @click="goToBack"
        class="p-2 rounded-lg hover:bg-white/10 transition-base active:scale-95"
        aria-label="Go back"
      >
        <ArrowLeftIcon class="h-6 w-6 text-white" />
      </button>
      <span class="font-semibold text-lg">{{ useNavbar.header.title }}</span>
    </div>
  </header>
</template>

<style scoped>
/* Additional navbar-specific styles if needed */
</style>
