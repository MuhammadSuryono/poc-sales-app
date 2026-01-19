export const useMaps = () => {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  }

  function getLocationUrl(lat: number, lng: number) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  }

  function getCurrentPosition(pos: PositionCallback, err: PositionErrorCallback) {
    navigator.geolocation.getCurrentPosition(pos, err, options)
  }

  return {
    getLocationUrl,
    getCurrentPosition
  }
}
