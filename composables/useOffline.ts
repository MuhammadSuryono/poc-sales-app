export const useOffline = () => {
    const isOnline = ref(true)
    const wasOffline = ref(false)

    const updateOnlineStatus = () => {
        const online = navigator.onLine

        // Track if we were offline and just came back online
        if (!isOnline.value && online) {
            wasOffline.value = true
            // Reset after 3 seconds
            setTimeout(() => {
                wasOffline.value = false
            }, 3000)
        }

        isOnline.value = online
    }

    onMounted(() => {
        updateOnlineStatus()
        window.addEventListener('online', updateOnlineStatus)
        window.addEventListener('offline', updateOnlineStatus)
    })

    onUnmounted(() => {
        window.removeEventListener('online', updateOnlineStatus)
        window.removeEventListener('offline', updateOnlineStatus)
    })

    return {
        isOnline,
        isOffline: computed(() => !isOnline.value),
        wasOffline,
        justCameOnline: computed(() => isOnline.value && wasOffline.value)
    }
}
