import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
    state: () => ({
        visible: false,
        text: 'Success'
    }),
    actions: {
        toggle(text: string) {
            this.visible = true
            this.text = text
            if (this.visible) {
                setTimeout(() => { this.visible = false }, 2000)
            }
        }
    }
})
