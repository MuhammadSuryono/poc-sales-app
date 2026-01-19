import { defineStore } from 'pinia'
import type { BreadCrumb } from '~/types/sidebar'

export const useSidebarStore = defineStore('sidebar', {
    state: () => ({
        width: 256, // default 256px = w-64
        breadCrumbs: [] as BreadCrumb[]
    }),
    actions: {
        setWidth(newWidth: number) {
            this.width = newWidth
        },
        setBreadCrumb(breadCrumbs: BreadCrumb[]) {
            this.breadCrumbs = breadCrumbs
        }
    }
})
