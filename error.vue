<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})

</script>

<template>
  <div>
   <Navbar />
    <main>
      <div class="min-h-screen bg-white text-gray-700 flex flex-col items-center justify-center p-8">
        <svg class="w-64 h-64 mb-6" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M256 0C114.84 0 0 114.84 0 256s114.84 256 256 256 256-114.84 256-256S397.16 0 256 0zm0 472c-119.388 0-216-96.612-216-216S136.612 40 256 40s216 96.612 216 216-96.612 216-216 216z" fill="#F87171"/>
          <path d="M256 128c-11.046 0-20 8.954-20 20v104c0 11.046 8.954 20 20 20s20-8.954 20-20V148c0-11.046-8.954-20-20-20zm0 208c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24z" fill="#F87171"/>
        </svg>

        <h1 class="text-5xl font-bold mb-4">{{ error.statusCode }}</h1>
        <p class="text-lg mb-6">{{ error.message || 'Halaman tidak ditemukan.' }}</p>

        <NuxtLink
            to="/"
            class="px-6 py-3 bg-color-5 text-white rounded-xl shadow hover:bg-color-3 transition duration-300"
        >
          Kembali ke Beranda
        </NuxtLink>
      </div>
    </main>
  </div>
</template>

<style scoped>

</style>