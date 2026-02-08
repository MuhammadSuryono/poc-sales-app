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

  function setShortNumberFormat(value: number) {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + ' jt'
    } else if (value >= 1000) {
      return (value / 1000).toFixed(0) + ' rb'
    }
    return value.toString()
  }

  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  return {
    setNumberFormat,
    setDateFormat,
    setTimeFormat,
    setDateTimeFormat,
    setShortNumberFormat,
    uuidv4,
  }
}
