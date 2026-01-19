import { defineStore } from 'pinia'

export const useLoadingState = defineStore('loadingState', {
  state: () => ({ 
    isLoading: false,
    timeOutLoading: 30000,
    titleLoading: 'Sedang memuat...'
  }),
  actions: {
    setLoading(title: string) {
      this.isLoading = true
      if (title !== null && title !== "") {
        this.titleLoading = title
      }

      setTimeout(() => {
        if (this.isLoading) {
          this.isLoading = false
        }
      }, this.timeOutLoading)
    },
    disLoading() {
      this.isLoading = false
      this.titleLoading = 'Sedang memuat...'
    }
  }
})
