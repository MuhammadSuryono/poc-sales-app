<template>
  <div class="flex flex-row gap-2 items-center">
    <FormInput v-model="search" placeholder="Search...">
      <template #icon>
        <MagnifyingGlassIcon class="h-5 w-5" />
      </template>
      <input type="text" class="rounded-xs border border-gray-300 px-2 py-2 text-sm" placeholder="Search" />
    </FormInput>
    <div class="flex flex-row gap-2 items-center">
      <ButtonSecondary text="Filter">
        <template #icon>
          <FunnelIcon class="h-5 w-5" />
        </template>
      </ButtonSecondary>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ButtonSecondary, FormInput } from '#components';
import { 
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'

const search = ref('')

const props = defineProps({
  searchValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:searchValue'])

watch(
  () => search.value,
  (val: string, newVal: string) => {
    emit('update:searchValue', newVal)
  }
)
</script>

<style>

</style>