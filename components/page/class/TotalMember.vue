<template>
  <div class="cursor-pointer hover:underline hover:text-blue-500 flex flex-row gap-1 items-center" @click="onAction">
    <UserGroupIcon class="h-5 w-5 text-gray-500" />
    {{ column?.numberFormat ? setNumberFormatWithSeparator(fieldData ?? 0) : fieldData ?? 0 }}
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { ColumnsData } from '~/types/table';
import { 
  UserGroupIcon
} from '@heroicons/vue/24/solid'

const { setNumberFormatWithSeparator} = useNumber()
defineProps({
  row: Object,
  fieldData: Number,
  column: Object as PropType<ColumnsData>,
  onAction: {
    type: Function as PropType<() => void>,
    default: () => {}
  }
})

</script>

<style>

</style>