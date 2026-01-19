<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 flex items-center px-3 justify-center bg-black/30 z-50 max-h-screen"
      @click.self="close"
    >
      <div class="bg-white rounded-sm shadow-xl max-w-5xl w-full overflow-hidden">
        <!-- Header -->
        <div v-if="hasHeader" class="p-4 border-b flex justify-between items-center">
          <slot name="header">
            <h3 class="text-md font-semibold">{{ header }}</h3>
          </slot>
          <button @click="close" class="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <!-- Body -->
        <div class="p-4 text-sm max-h-[calc(100vh-16rem)] overflow-auto">
          <slot />
        </div>

        <!-- Footer -->
        <div v-if="hasFooter" class="p-4 border-t flex justify-end space-x-2">
          <slot name="footer">
            <ButtonSecondary
              @click="close"
              text="Close"
            />
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ButtonSecondary } from '#components';
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps<{
  show: boolean
  header?: string
  footer?: boolean,
  size?: {
    type: string,
    default: 'sm'
  }
}>()

const emit = defineEmits(['update:show'])

const hasHeader = computed(() => !!props.header || !!useSlots().header)
const hasFooter = computed(() => props.footer || !!useSlots().footer)

function close() {
  emit('update:show', false)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
