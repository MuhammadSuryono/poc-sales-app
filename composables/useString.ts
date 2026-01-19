export const useUseString = () => {

  function setNumberFormat(value: number) {
    return value.toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
    })
  }

  function setDateFormat(value: Date) {
    return value.toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  function setTimeFormat(value: Date) {
    return value.toLocaleString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  function setDateTimeFormat(value: Date) {
    return value.toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  return {
    setNumberFormat,
    setDateFormat,
    setTimeFormat,
    setDateTimeFormat,
  }
}
