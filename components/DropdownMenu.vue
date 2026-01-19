<script setup lang="ts">
import { onMounted, onBeforeUnmount, defineEmits } from 'vue'
import type { DropdownActionItems } from '~/types/table';

const props = defineProps<{
  position: { x: number; y: number }
  show: boolean
  items: DropdownActionItems[],
  itemRow?: any,
}>()

const emit = defineEmits(['close'])

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.dropdown-menu')) {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div
    v-if="show"
    class="dropdown-menu fixed z-50 bg-white divide-y divide-gray-100 rounded-xs shadow-md w-44"
    :style="{ top: (position.y + 20) + 'px', left: (position.x - 180) + 'px' }"
  >
    <ul class="py-2 text-sm text-gray-700">
      <li
        v-for="(item, index) in items"
        :key="index"
      >
        <button
          class="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
          @click="item?.action?.(itemRow); emit('close')"
        >
          <component :is="item.icon" class="w-4 h-4" />
          {{ item.label }}
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.dropdown-menu {
  min-width: 10rem;
}
</style>
