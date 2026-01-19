import { Geolocation } from '@capacitor/geolocation'
import { getDistance, isPointWithinRadius, isPointInPolygon } from 'geolib'
import { useLocation } from '~/stores/location';

export const useUserLocation = () => {
  const locationSore = useLocation();
  const coords = computed(() => locationSore.myLocation)
  const address = computed(() => locationSore.myAddress)
  const locationUrlMap = ref<string>("")

  const getLocation = async () => {
    try {
      const pos = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 10000,
        minimumUpdateInterval: 1000,
      })
      locationSore.setLocation(pos.coords.latitude, pos.coords.longitude)
      const adr = await reverseGeocode(coords.value.lat, coords.value.lng)
      locationSore.setAddress(adr)
    } catch (err) {
      console.error("Gagal ambil lokasi:", err)
    }
  }

  const reverseGeocode = async (latitude: number, longitude: number) => {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=c808fbb3f98f4c2594aeebf8fc8f68f8&language=en&pretty=1`
    )
    const data = await response.json()
    if (data.total_results > 0) {
      locationUrlMap.value = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
      return data.results[0].formatted
    }
    return "" // alamat lengkap
  }

  /**
   * Menghitung jarak ke titik tujuan (dalam meter)
   */
  const calculateDistance = (target: { lat: number; lng: number }) => {
    if (!coords.value) return null
    const distance = getDistance(
      { latitude: coords.value.lat, longitude: coords.value.lng },
      { latitude: target.lat, longitude: target.lng }
    )
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

  return {
    coords,
    address,
    getLocation,
    calculateDistance,
    isInsideRadius,
    isInsidePolygon,
  }
}