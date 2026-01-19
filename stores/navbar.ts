import { defineStore } from 'pinia'
import type { NavbarType } from '~/types/navbar'

export const useNavbarStore = defineStore('navbar', {
    state: () => ({
        header: {
            type: 'MAIN' as NavbarType,
            title: ''
        }
    }),
    actions: {
        setHeader(typeOfHeader: NavbarType, title?: string) {
            this.header.type = typeOfHeader
            if (title) {
                this.header.title = title
            }
        }
    }
})