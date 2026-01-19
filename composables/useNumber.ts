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

  return {
    setNumberFormat,
    setNumberFormatWithSeparator,
  }
}
