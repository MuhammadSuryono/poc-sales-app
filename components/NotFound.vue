<template>
  <div class="min-h-screen flex flex-col items-center justify-center scrollbar-hide">
    <div class="text-center">
      <slot name="icon">
        <ExclamationTriangleIcon class="mx-auto h-16 w-16 text-red-500" />
      </slot>

      <h1 class="mt-4 text-4xl font-bold text-gray-800" v-if="useTitle">404 - Not Found</h1>
      <p class="mt-2 text-lg text-gray-600">
        {{ text }}
      </p>

      <slot name="cta">
        <a
          href="/"
          class="mt-6 inline-block px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
        >
          Kembali ke Beranda
        </a>
      </slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
interface LocalProps {
  text?: string,
  useTitle?: boolean
}

withDefaults(defineProps<LocalProps>(), {
  text: 'Halaman yang kamu cari tidak ditemukan',
  useTitle: true
})

</script>

<style>

</style>