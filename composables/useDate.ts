export const useDate = () => {
  const today = computed(() => new Date().toISOString().slice(0, 10))
  const start = computed(() => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date.toISOString()
  })
  const end = computed(() => {
    const date = new Date()
    date.setHours(24, 0, 0, 0)
    return date.toISOString()
  })
  const dateToday = computed(() => new Date().toISOString().slice(0, 10))
  return {
    today,
    start,
    end,
    dateToday,
  }
}
