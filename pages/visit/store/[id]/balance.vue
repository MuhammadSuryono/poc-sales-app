<template>
  <div class="flex w-full">
    <CardNavbarBack title="Riwayat Balance" />
    <div class="w-full justify-center">
      <NotFound v-if="true" text="Data balance kosong" :use-title="false">
        <template #cta>
          <ButtonRefresh :action="() => console.log('refresh')" />
        </template>
        <template #icon>
          <div class="flex items-center justify-center">
            <ArchiveBoxXMarkIcon class="h-12 w-12 text-gray-400" />
          </div>
        </template>
      </NotFound>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ArchiveBoxXMarkIcon } from '@heroicons/vue/24/outline';


</script>

<style>

</style>