<script setup lang="ts">
import { useUserStore } from '~/stores/user'

const menuOpen = ref(false)
const userStore = useUserStore()
const user = computed(() => userStore?.user)

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const logout = () => {
  userStore?.logout()
  navigateTo("/auth/login")
}
</script>

<template>
  <div class="relative">
    <button @click="toggleMenu">
      <NuxtImg class="h-8 w-8 rounded-full hover:border-3 text-gray-500 hover:cursor-pointer"
               :src="user?.profile" />
    </button>
    <div v-if="menuOpen" class="absolute right-0 mt-7 w-45 sm:w-100 bg-white shadow-2xl rounded">
      <button class="w-full text-left px-4 py-2 hover:bg-gray-100" @click="logout">Logout</button>
    </div>
  </div>
</template>


<style scoped>

</style>