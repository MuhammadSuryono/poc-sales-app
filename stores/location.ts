import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Location {
    lat: number
    lng: number
}

/**
 * Location Store - Composition API
 * Manages user's current location and address
 */
export const useLocation = defineStore('location', () => {
    // State
    const myLocation = ref<Location>({
        lat: 0,
        lng: 0
    })
    const myAddress = ref<string>('')

    // Getters
    const hasLocation = computed(() => {
        return myLocation.value.lat !== 0 && myLocation.value.lng !== 0
    })

    const coordinates = computed(() => ({
        latitude: myLocation.value.lat,
        longitude: myLocation.value.lng
    }))

    // Actions
    const setLocation = (lat: number, lng: number) => {
        myLocation.value = { lat, lng }
    }

    const setAddress = (address: string) => {
        myAddress.value = address
    }

    const clearLocation = () => {
        myLocation.value = { lat: 0, lng: 0 }
        myAddress.value = ''
    }

    return {
        // State
        myLocation,
        myAddress,

        // Getters
        hasLocation,
        coordinates,

        // Actions
        setLocation,
        setAddress,
        clearLocation,
    }
})