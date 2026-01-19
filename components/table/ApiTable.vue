<template>
  <div>
    <div class="overflow-x-auto shadow-md sm:rounded-sm mt-3">
      <table class="w-full text-sm text-left rtl:text-right">
        <thead class="text-sm capitalize bg-gray-200 text-gray-600">
          <tr>
            <th v-if="withCheckbox" class="px-6 py-5 w-10">
              <div class="flex items-center">
                <input
                  id="checkbox-all"
                  type="checkbox"
                  class="w-4 h-4 text-color-5 bg-gray-100 border-gray-300 rounded focus:ring-color-5"
                />
                <label
                  for="checkbox-all"
                  class="sr-only"
                  >checkbox</label
                >
              </div>
            </th>
            <th class="px-6 py-5 font-medium" v-for="(col, i) in columns" :key="i"> {{ col.headerName }} </th>
            <th v-if="withAction" class="w-10 px-6"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in tableData"
            :key="item.id"
            class="bg-white border-b border-gray-200 hover:bg-gray-100 text-sm"
          >
            <td v-if="withCheckbox" class="px-6 py-4">
              <div class="flex items-center">
                <input
                  id="checkbox-{{ item.id }}"
                  type="checkbox"
                  class="w-4 h-4 text-color-5 bg-gray-100 border-gray-300 rounded focus:ring-color-5"
                />
                <label
                  for="checkbox-{{ item.id }}"
                  class="sr-only"
                  >checkbox</label
                >
              </div>
            </td>
            <td
              class="px-6 py-4"
              v-for="(col, colIndex) in columns"
              :key="colIndex"
            >
              <component
                v-if="col.renderCell"
                :is="col.renderCell({ row: item, field: col.field, value: item[col.field], column: col }).component"
                v-bind="col.renderCell({ row: item, field: col.field, value: item[col.field], column: col }).props"
              />
              <span v-else>
                {{ col?.numberFormat ? setNumberFormatWithSeparator(item[col.field]) : item[col.field] }}
              </span>
            </td>

            <td class="relative" v-if="withAction">
              <EllipsisHorizontalIcon class="h-6 w-6 cursor-pointer" 
                @click.stop="toggleDropdown($event, item)"/>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="h-10 px-3 flex items-center justify-end gap-2 text-sm">
        <span class="text-gray-600">
          Showing 5 to 10 of 1,000 entries
        </span>
      </div>
    </div>
    <div v-if="withPagination" class="mt-5 flex items-center justify-center gap-2 text-sm">
      <ArrowLeftIcon class="h-6 w-6 px-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:hidden"
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
      />

      <span v-for="page in visiblePages" :key="page">
        <button
            @click="goToPage(page)"
            :class="[
            'px-3 py-1 rounded',
            currentPage === page ? 'bg-color-5 text-white' : 'bg-gray-200 hover:bg-gray-300'
          ]"
        >
          {{ page }}
        </button>
      </span>

      <ArrowRightIcon class="h-6 w-6 px-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
      />
    </div>

    <DropdownMenu
      v-if="withAction"
      :position="dropdownPosition"
      :show="dropdownOpen"
      :items="dropdownItems"
      @close="closeDropdown"
      :item-row="activeRowId"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DropdownMenu from '@/components/DropdownMenu.vue'
import type { ColumnsData, DropdownActionItems } from '~/types/table';
import { ArrowRightIcon, ArrowLeftIcon, EllipsisHorizontalIcon } from '@heroicons/vue/24/outline'

const props = withDefaults(defineProps<{
  url: string,
  columns: ColumnsData[],
  withColumnNo?: boolean,
  withAction?: boolean,
  withCheckbox?: boolean,
  withPagination: boolean,
  pagination?: {
    perPage: number,
  }
  actionItems?: DropdownActionItems[]
}>(), {
  withPagination: true,
  url: "",
})
const dropdownOpen = ref(false)
const dropdownPosition = ref({ x: 0, y: 0 })
const activeRowId = ref<any | null>(null)
const currentPage = ref<number>(1)
const { setNumberFormatWithSeparator } = useNumber()

const dropdownItems = ref<DropdownActionItems[]>([])

const toggleDropdown = (event: MouseEvent, row: any) => {
  if (dropdownOpen.value && activeRowId.value === row) {
    dropdownOpen.value = false
    activeRowId.value = null
    return
  }

  dropdownItems.value = props.actionItems

  dropdownOpen.value = true
  activeRowId.value = row
  dropdownPosition.value = {
    x: event.clientX,
    y: event.clientY
  }
}

const closeDropdown = () => {
  dropdownOpen.value = false
  activeRowId.value = null
}

const tableData = [
  { id: '1', key: 'CDE-001', name: 'Kelas X1', total: 5609 },
  { id: '2', key: 'CDE-002', name: 'Kelas X2', total: 888 }
]

const totalPages = computed(() => {
  return 10
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  let start = Math.max(1, currentPage.value - 2)
  let end = Math.min(total, currentPage.value + 2)

  // Always show 5 pages if possible
  if (end - start < 4) {
    if (start === 1) {
      end = Math.min(5, total)
    } else if (end === total) {
      start = Math.max(1, total - 4)
    }
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})
</script>

<style>

</style>