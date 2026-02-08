import { Geolocation } from '@capacitor/geolocation'
import { getDistance, isPointWithinRadius, isPointInPolygon } from 'geolib'
import { useLocation } from '~/stores/location'
import { useGeocodingApi } from '~/services/api'
import { useUserStore } from '~/stores/user'
import type { PositionHistory } from '~/types/user'
import { TABLE_USER_POSITION_HISTORY } from '~/types/table'

export const useUserLocation = () => {
  const locationStore = useLocation()
  const coords = computed(() => locationStore.myLocation)
  const address = computed(() => locationStore.myAddress)
  const locationUrlMap = ref<string>('')
  const { reverseGeocode } = useGeocodingApi()
  const { addPositionHistory, user } = useUserStore()
  const { $supabase} = useNuxtApp()
  const FIFTEEN_MINUTES = 15 * 60 * 1000
  let intervalId: any = null

  const getLocation = async () => {
    try {
      const pos = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 10000,
        minimumUpdateInterval: 1000,
      })
      locationUrlMap.value = `https://www.google.com/maps/search/?api=1&query=${pos.coords.latitude},${pos.coords.longitude}`

      const adr = await reverseGeocode(pos.coords.latitude, pos.coords.longitude)
      locationStore.setAddress(adr)
    } catch (err) {
      locationStore.setAddress('-')
      console.error('Failed to get location:', err)
    }
  }

  /**
   * Menghitung jarak ke titik tujuan (dalam meter) - Mengembalikan angka
   */
  const calculateDistanceRaw = (target: { lat: number; lng: number }) => {
    if (!coords.value) return null
    return getDistance(
      { latitude: coords.value.lat, longitude: coords.value.lng },
      { latitude: target.lat, longitude: target.lng }
    )
  }

  /**
   * Menghitung jarak ke titik tujuan (dalam meter) - Mengembalikan string format
   */
  const calculateDistance = (target: { lat: number; lng: number }) => {
    const distance = calculateDistanceRaw(target)
    if (distance === null) return null
    return distance >= 1000 ? `${(distance / 1000).toFixed(2)} Km` : `${distance} Meter`
  }

  /**
   * Cek apakah user berada dalam radius (meter) dari titik target
   */
  const isInsideRadius = (target: { lat: number; lng: number }, radius: number) => {
    if (!coords.value) return false
    return isPointWithinRadius(
      { latitude: coords.value.lat, longitude: coords.value.lng },
      { latitude: target.lat, longitude: target.lng },
      radius
    )
  }

  /**
   * Cek apakah user berada dalam polygon (array titik [lat, lng])
   */
  const isInsidePolygon = (polygon: { lat: number; lng: number }[]) => {
    if (!coords.value) return false
    return isPointInPolygon(
      { latitude: coords.value.lat, longitude: coords.value.lng },
      polygon.map(p => ({ latitude: p.lat, longitude: p.lng }))
    )
  }

  const distanceInMeter = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
    const R = 6371000
    const dLat = ((b.lat - a.lat) * Math.PI) / 180
    const dLng = ((b.lng - a.lng) * Math.PI) / 180

    const lat1 = (a.lat * Math.PI) / 180
    const lat2 = (b.lat * Math.PI) / 180

    const x =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2)

    const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))
    return R * c
  }

  async function sendPositionToServer() {
    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 10000,
      minimumUpdateInterval: 1000,
    })

    const current = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    }

    if (!coords.value) {
      const {data} = await $supabase
        .from(TABLE_USER_POSITION_HISTORY)
        .select('*')
        .eq('user_id', user?.user_id)
        .order('created_at', { ascending: false })
        .single()
      if (data) {
        const distance = distanceInMeter({
          lat: data.lat,
          lng: data.lng,
        }, current)
        if (distance < 30) {
          console.log('SKIP (still same location)', distance)
          return
        }
        console.log('SEND TO SERVER')
        await addPositionHistory({
          user_id: user?.user_id as string,
          lat: data.lat,
          lng: data.lng,
          timestamp: new Date().toISOString(),
        })
        
        locationStore.setLocation(data.lat, data.lng)
        return
      }
    }

    const distance = distanceInMeter(coords.value, current)
    if (distance < 30) {
      console.log('SKIP (still same location)', distance)
      return
    }

    const payload: PositionHistory = {
      user_id: user?.user_id as string,
      lat: current.lat,
      lng: current.lng,
      timestamp: new Date().toISOString(),
    }

    console.log('SEND TO SERVER')
    await addPositionHistory(payload)
    locationStore.setLocation(current.lat, current.lng)
  }

  const startTracking = () => {
    sendPositionToServer()

    intervalId = setInterval(() => {
      sendPositionToServer()
    }, FIFTEEN_MINUTES)
  }

  const stopTracking = () => {
    if (intervalId) clearInterval(intervalId)
    intervalId = null
  }

  return {
    coords,
    address,
    myAddress: address,
    getLocation,
    calculateDistance,
    calculateDistanceRaw,
    isInsideRadius,
    isInsidePolygon,
    startTracking,
    stopTracking,
  }
}