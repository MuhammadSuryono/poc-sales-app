import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { TABLE_REIMBURSEMENT_GENERAL, TABLE_REIMBURSEMENT_STORE, TABLE_TIKET, TABLE_USER, TABLE_USER_ACTIVITY, TABLE_USER_POSITION_HISTORY, TABLE_VISIT_HISTORY, TABLE_VISIT_IMAGE, V_TABLE_REIMBURSEMENT } from '~/types/table'
import {
  type User,
  type Tiket,
  type VisitHistory,
  type StatisticUserToday,
  type HistoryTransaction,
  type StatisticStore,
  type Noo,
  sampleTiket,
  sampleVisitHistory,
  sampleUserLogin,
  sampleStatisticUser,
  sampleHistoryTransaction,
  sampleStatisticStore,
  sampleDataNoo,
  type PositionHistory,
  type Reimbursement,
  type VReimbursementSummary,
  type UserActivity,
  type VisitImage,
  type ReimbursementStore
} from '~/types/user'

/**
 * User Store - Composition API
 * Manages user authentication, visit data, and statistics
 */
export const useUserStore = defineStore('userStore', () => {
  // State
  const allTiket = ref<Tiket[]>([])
  const tolerance = ref(100000) // in meters
  const visitHistory = ref<VisitHistory[]>([])
  const user = ref<User | null>(useStorage().getItemObject('user') ?? null)
  const detailUser = ref<User | null>(null)
  const isLoggedIn = ref(false)
  const userLogin = ref<User[]>(sampleUserLogin)
  const userStatistic = ref<StatisticUserToday[]>(sampleStatisticUser)
  const historyTransaction = ref<HistoryTransaction[]>(sampleHistoryTransaction)
  const statisticStore = ref<StatisticStore[]>(sampleStatisticStore)
  const reimbursementsGeneral = ref<Reimbursement[]>([])
  const reimbursementsStore = ref<ReimbursementStore[]>([])
  const nooData = ref<Noo[]>(sampleDataNoo)
  const { $supabase } = useNuxtApp()
  const { dateToday, start, end} = useDate()

  // Getters
  const currentUser = computed(() => user.value)
  const isAuthenticated = computed(() => isLoggedIn.value && user.value !== null)

  // Actions
  const getAllTiketUser = (): Tiket[] => {
    if (!user.value) return []
    return allTiket.value.filter(t => t.user_id === user.value?.user_id)
  }

  const fetchAllTiketUser = async (): Promise<void> => {
    if (!user.value) return
    const { data, error } = await $supabase
      .from(TABLE_TIKET)
      .select('*')
      .eq('user_id', user.value?.user_id)
    
    if (error) {
      console.log(error)
      return
    }
    allTiket.value = data ?? []
  }

  const fetchVisitHistory = async (customerId: string): Promise<void> => {
    if (!user.value) return
    const { data, error } = await $supabase
      .from(TABLE_VISIT_HISTORY)
      .select('*')
      .eq('customer_no', customerId)
    
    if (error) {
      console.log(error)
      return
    }
    visitHistory.value = data ?? []
  }

  const fetchReimbursementsGeneral = async (userId: string): Promise<void> => {
    if (!user.value) return
    const { data, error } = await $supabase
      .from(TABLE_REIMBURSEMENT_GENERAL)
      .select('*')
      .eq('user_id', userId)
    
    if (error) {
      console.log(error)
      return
    }
    reimbursementsGeneral.value = data ?? []
  }

  const fetchReimbursementsStore = async (storeId: string): Promise<void> => {
    if (!user.value) return
    const { data, error } = await $supabase
      .from(TABLE_REIMBURSEMENT_STORE)
      .select('*')
      .eq('customer_no', storeId)
    
    if (error) {
      console.log(error)
      return
    }
    reimbursementsStore.value = data ?? []
  }

  const fetchDetailUser = async (userId: string): Promise<void> => {
    if (!user.value) return
    const { data, error } = await $supabase
      .from(TABLE_USER)
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error) {
      console.log(error)
      return
    }
    detailUser.value = data ?? null
  }

  const updateTicketData = async (data: Tiket) => {
    if (!user.value) return
    const { error } = await $supabase
      .from(TABLE_TIKET)
      .update(data)
      .eq('id', data.id)
    
    if (error) {
      console.log(error)
      return
    }
    await fetchAllTiketUser()
  }

  const addToHistory = async (tiket: Tiket) => {
    const visitHistoryItem: VisitHistory = {
      ...tiket,
      user_visit_name: user.value?.name ?? '',
      // userVisitEmail: user.value?.email ?? ''
    }
    await $supabase
      .from(TABLE_VISIT_HISTORY)
      .insert(visitHistoryItem)
  }

  const login = (userData: User) => {
    user.value = userData
    isLoggedIn.value = true
    useStorage().saveDataAsObject('user', userData)
  }

  const logout = () => {
    user.value = null
    isLoggedIn.value = false
    useStorage().deleteItem('token')
    useStorage().deleteItem('user')
  }

  const getStatisticTransactionToday = (userId: string): StatisticUserToday | undefined => {
    return userStatistic.value.find(s => s.IdSales === userId)
  }

  const updateStatistic = (userId: string, totalTransaction: number) => {
    const statistic = getStatisticTransactionToday(userId)
    if (statistic) {
      statistic.TotalCustomer += 1
      statistic.totalTransaction += totalTransaction
    }
  }

  const getStatisticStore = (customerId: string): StatisticStore | undefined => {
    return statisticStore.value.find(s => s.customerId === customerId)
  }

  const updateStatisticStore = (customerId: string, totalItems: number, totalSales: number) => {
    const statistic = getStatisticStore(customerId)
    if (statistic) {
      statistic.totalItems += totalItems
      statistic.totalSales += totalSales
    }
  }

  const addPositionHistory = async (position: PositionHistory) => {
    await $supabase
      .from(TABLE_USER_POSITION_HISTORY)
      .insert(position)
  }

  const addGeneralReimbursement = async (userId: string, data: Reimbursement): Promise<void> => {
    const id = useUseString().uuidv4()
    await $supabase
      .from(TABLE_REIMBURSEMENT_GENERAL)
      .insert({
        ...data,
        user_id: userId,
        id: id
      })
      .then(async () => {
        await fetchReimbursementsGeneral(userId)
        await addUserActivity({
          id_related: id,
          user_id: userId,
          category: 'REIMBURSEMENT',
          description: `Menambahkan reimbursement general ${data.category}`,
          timestamp: new Date().toISOString(),
        })
      })
  }

  const addStoreReimbursement = async (userId: string, data: ReimbursementStore): Promise<void> => {
    const id = useUseString().uuidv4()
    await $supabase
      .from(TABLE_REIMBURSEMENT_STORE)
      .insert({
        ...data,
        user_id: userId,
        id: id
      })
      .then(async () => {
        await fetchReimbursementsStore(data?.customer_no)
        await addUserActivity({
          id_related: id,
          user_id: userId,
          category: 'REIMBURSEMENT',
          description: `Menambahkan reimbursement store ${data.category}`,
          timestamp: new Date().toISOString(),
        })
      })

  }

  const addUserActivity = async (data: UserActivity): Promise<void> => {
    await $supabase
      .from(TABLE_USER_ACTIVITY)
      .insert({
        ...data
      })
  }

  const saveBatchVisitImage = async (data: VisitImage[], removes: string[] = []) => {
    if (removes.length > 0) {
      await $supabase
        .from(TABLE_VISIT_IMAGE)
        .delete()
        .in('id', removes)
    }
    for (const item of data) {
      await $supabase
        .from(TABLE_VISIT_IMAGE)
        .upsert(item, {
          onConflict: 'id'
        })
    }
  }

  const fetchVisitImage = async (visitId: string): Promise<VisitImage[]> => {
    if (!user.value) return []
    const { data, error } = await $supabase
      .from(TABLE_VISIT_IMAGE)
      .select('*')
      .eq('visit_id', visitId)
    
    if (error) {
      console.log(error)
      return []
    }
    return data ?? []
  }

  return {
    // State
    allTiket,
    tolerance,
    visitHistory,
    user,
    detailUser,
    isLoggedIn,
    userLogin,
    userStatistic,
    historyTransaction,
    statisticStore,
    nooData,
    reimbursementsGeneral,
    reimbursementsStore,

    // Getters
    currentUser,
    isAuthenticated,

    // Actions
    getAllTiketUser,
    addToHistory,
    login,
    logout,
    getStatisticTransactionToday,
    updateStatistic,
    getStatisticStore,
    updateStatisticStore,
    addPositionHistory,
    addGeneralReimbursement,
    fetchAllTiketUser,
    fetchVisitHistory,
    fetchReimbursementsGeneral,
    fetchDetailUser,
    updateTicketData,
    addUserActivity,
    saveBatchVisitImage,
    fetchVisitImage,
    fetchReimbursementsStore,
    addStoreReimbursement
  }
})
