export const useStorage = () => {
  function saveDataAsObject(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data))
  }

  function saveDataAsString(key: string, value: string) {
    localStorage.setItem(key, value)
  }

  function getItemString(key: string) {
    return localStorage.getItem(key)
  }

  function getItemObject(key: string) {
    return JSON.parse(localStorage.getItem(key) as string)
  }

  function deleteItem(key: string) {
    localStorage?.removeItem(key)
  }

  return {
    saveDataAsObject,
    saveDataAsString,
    getItemObject,
    getItemString,
    deleteItem
  }
}
