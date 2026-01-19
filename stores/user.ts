import { defineStore } from 'pinia'
import { type Tiket, type VisitHistory, type User, sampleUserLogin, sampleTiket, sampleVisitHistory, sampleStatisticUser, type StatisticUserToday, sampleHistoryTransaction, type HistoryTransaction, sampleStatisticStore, type StatisticStore, sampleDataNoo, type Noo } from '~/types/user'

export const useUserStore = defineStore('userStore', {
    state: () => ({
      allTiket: sampleTiket as Tiket[],
      tollerance: 100000, // in meter
      visitHistory: sampleVisitHistory as VisitHistory[],
      user: useStorage().getItemObject('user') ?? null,
      isLoggedIn: false,
      userLogin: sampleUserLogin as User[],
      userStatistic: sampleStatisticUser as StatisticUserToday[],
      historyTransaction: sampleHistoryTransaction as HistoryTransaction[],
      statisticStore: sampleStatisticStore as StatisticStore[],
      nooData: sampleDataNoo as Noo[]
    }),
    actions: {
      getAllTiketUser() {
        const userData: User = this.user
        return this.allTiket?.filter(t => t.userId === userData?.userId)
      },
      addToHistory(tiket: Tiket) {
        const visitHistory = {
          ...tiket,
          userVisitName: this.user?.name ?? '',
          userVisitEmail: this.user?.email ?? ''
        }
        this.visitHistory.push(visitHistory)
      },
      login(user: User) {
        this.user = user
        this.isLoggedIn = true
        useStorage().saveDataAsObject('user', user)
      },
      logout() {
        this.user = null
        this.isLoggedIn = false
        useStorage().deleteItem('token')
      },
      getStatisticTransactionToday(userId: string) {
        const statistic = this.userStatistic?.find(s => s.IdSales === userId)
        return statistic;
      },
      updateStatistic(userId: string, totalTransaction: number) {
        const statistic = this.getStatisticTransactionToday(userId)
        console.log(userId, totalTransaction, statistic)
        if (statistic) {
          statistic.TotalCustomer += 1
          statistic.totalTransaction += totalTransaction
        }
      },
      getStatisticStore(customerId: string) {
        return this.statisticStore?.find(s => s.customerId === customerId)
      },
      updateStatisticStore(customerId: string, totalItems: number, totalSales: number) {
        const statistic = this.getStatisticStore(customerId)
        if (statistic) {
          statistic.totalItems += totalItems
          statistic.totalSales += totalSales
        }
      },

    },
})
