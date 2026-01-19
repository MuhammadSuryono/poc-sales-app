<script setup lang="ts">
import AccountMenu from '~/components/AccountMenu.vue'
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
    useNavbar.setHeader('MAIN')
  }
}
</script>

<template>
  <header class="flex justify-between items-center bg-white border-b p-3 fixed top-0 left-0 right-0 z-50" :class="{'hidden lg:flex': navbarType === 'BACK', 'flex': navbarType === 'MAIN'}">
    <NuxtLink to="/"><span class="text-primary-hover font-bold text-[25pt]">KJ</span><span class="text-success">{{ user?.role }}</span></NuxtLink>
    <div class="flex items-center gap-4">
      <AccountMenu />
    </div>
  </header>
  <header class="flex justify-between items-center bg-white border-b p-3 fixed top-0 left-0 right-0 z-50" :class="{'flex lg:hidden': navbarType === 'BACK', 'hidden': navbarType === 'MAIN'}">
    <div class="flex flex-row gap-4 justify-start items-center py-3">
      <ArrowLeftIcon class="h-6 w-6 text-gray-700 block lg:hidden" @click="goToBack"/>
      <span class="font-semibold text-lg">{{ useNavbar.header.title }}</span>
    </div>
  </header>
</template>

<style scoped>
.text-border {
  -webkit-text-stroke: 0.5px black; /* Tebal dan warna border */
}
</style>