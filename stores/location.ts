import { defineStore } from 'pinia'

export const useLocation = defineStore('location', {
    state: () => ({
        myLocation: {
            lat: 0,
            lng: 0
        },
        myAddress: ""
    }),
    actions: {
        setLocation(lat: number, lng: number) {
            this.myLocation.lat = lat
            this.myLocation.lng = lng
        },
        setAddress(address: string) {
            this.myAddress = address
        }
    }
})