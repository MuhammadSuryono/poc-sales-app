<script setup lang="ts">
import {
  RectangleGroupIcon,
  EllipsisHorizontalIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ArrowDownLeftIcon
} from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import { useSidebarStore } from '~/stores/sidebar'
import type { BreadCrumb } from '~/types/sidebar'

const sidebarStore = useSidebarStore()
const breadCrumbsState = ref<BreadCrumb[]>([])

interface MenuItem {
  title: string
  iconIsLink: boolean
  icon: any
  to?: string
  children?: MenuItem[]
  expanded?: boolean
  active?: boolean
}

const menus = ref<MenuItem[]>([
  {
    title: 'Dashboard',
    iconIsLink: false,
    icon: RectangleGroupIcon,
    to: '/',
    active: true,
  },
  {
    title: 'Incoming Visit',
    iconIsLink: false,
    icon: ArrowDownLeftIcon,
    to: '/incoming',
    active: false,
  },
])

const setMenuActive = (index:number, childIndex:number) => {
  breadCrumbsState.value = []
  for (const menu of menus.value) {
    if (menu.active) {
      menu.active = false
      break
    }

    if (menu.expanded) {
      for (const menuItem of menu?.children) {
        if (menuItem.active) {
          menuItem.active = false
        }
      }
    }
  }

  if (childIndex !== undefined) {
    const parentMenu = menus.value[index]
    breadCrumbsState.value?.push({
      label: parentMenu.title,
      path: parentMenu.to,
      active: false,
      icon: parentMenu.icon
    })
    
    parentMenu.expanded = true
    for (const menu of parentMenu.children) {
      if (menu.active) {
        menu.active = false
      }
    }
    parentMenu.children[childIndex].active = true
    breadCrumbsState.value?.push({
      label: parentMenu?.children[childIndex]?.title,
      path: parentMenu?.children[childIndex]?.to,
      active: true,
      icon: parentMenu?.children[childIndex]?.icon
    })
  } else {
    menus.value[index].active = !menus.value[index].active
    breadCrumbsState.value?.push({
      label: menus.value[index].title,
      path: menus.value[index].to,
      active: false,
      icon: menus.value[index].icon
    })
  }

  sidebarStore.setBreadCrumb(breadCrumbsState?.value)

}
</script>


<template>
  <aside class="fixed top-20 left-0 w-64 h-[calc(100vh-64px)]
  bg-white border-r p-4 flex flex-col overflow-y-auto text-gray-700 text-sm font-semibold transition-all duration-300"
         :style="{ width: `${sidebarStore.width}px` }">
    <div class="flex flex-col gap-2">
      <template v-for="(menu, index) in menus" :key="index">
        <!-- Menu Link -->
        <NuxtLink
            v-if="menu.to"
            :to="menu.to"
            class="flex flex-row gap-2 hover:bg-gray-100 p-2 rounded-sm items-center"
            :class="{'border-l': menu.active }"
            @click="setMenuActive(index)"
        >
          <component :is="menu.icon" class="w-5 h-5" />
          {{ menu.title }}
        </NuxtLink>

        <!-- Menu Expand -->
        <div
            v-else
            @click="menu.expanded = !menu.expanded"
            class="flex flex-row gap-3 hover:bg-gray-100 p-2 rounded-sm items-center justify-between hover:cursor-pointer group"
        >
          <div class="flex flex-row gap-2 items-center">
            <!-- Icon saat collapsed -->
            <ChevronRightIcon v-if="!menu.expanded" class="w-5 h-5 hidden group-hover:block" />
            <ChevronDownIcon v-if="menu.expanded" class="w-5 h-5 hidden group-hover:block" />
            <component :is="menu.icon" class="w-5 h-5 group-hover:hidden" />
            <span>{{ menu.title }}</span>
          </div>

          <EllipsisHorizontalIcon v-if="!menu.expanded" class="w-5 h-5 hidden group-hover:block" />
          <EllipsisHorizontalIcon v-if="menu.expanded" class="w-5 h-5" />
        </div>
        <!-- Submenu -->
        <div v-if="menu.expanded && menu.children" class="flex flex-col pl-3 gap-2">
          <NuxtLink
              v-for="(child, childIndex) in menu.children"
              :key="childIndex"
              :to="child.to"
              @click="setMenuActive(index, childIndex)"
              class="flex flex-row gap-2 hover:bg-gray-100 p-2 rounded-sm items-center text-gray-700"
              :class="{'border-l': child.active }"
          >
            <component :is="child.icon" class="w-5 h-5" v-if="child.iconIsLink === false" />
            <NuxtImg v-else :src="child.icon" class="w-5 h-5" />
            {{ child.title }}
          </NuxtLink>
        </div>
      </template>
    </div>
  </aside>
</template>


<style scoped>
.border-l {
  border-color: var(--color-primary);
  border-width: 0 0 0 3px;
  background-color: var(--color-color-10);
  color: var(--color-primary);
}
</style>