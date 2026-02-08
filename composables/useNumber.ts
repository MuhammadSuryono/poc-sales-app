export const useNumber = () => {

  function setNumberFormat(value: number) {
    return value.toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
    })
  }

  function setNumberFormatWithSeparator(value: number) {
    return value.toLocaleString('id-ID', {
      useGrouping: true,
    })
  }

  function setShortNumberFormat(value: number) {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + ' jt'
    } else if (value >= 1000) {
      return (value / 1000).toFixed(0) + ' rb'
    }
    return value.toString()
  }

  return {
    setNumberFormat,
    setNumberFormatWithSeparator,
    setShortNumberFormat,
  }
}
