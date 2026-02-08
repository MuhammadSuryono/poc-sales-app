import { defineStore } from "pinia";
import { TABLE_ORDER, TABLE_ORDER_PRODUCT, TABLE_REIMBURSEMENT_GENERAL, TABLE_REIMBURSEMENT_STORE, TABLE_TIKET, TABLE_USER_ACTIVITY, TABLE_USER_POSITION_HISTORY, TABLE_VISIT_IMAGE, V_TABLE_REIMBURSEMENT, V_TABLE_REIMBURSEMENT_LIST, V_TABLE_USER_POSITION_HISTORY } from "~/types/table";
import type { PositionHistory, ReimbursementStore, Tiket, UserActivity, UserPositionHistory, VisitImage, VReimbursementSummary } from "~/types/user";

export const useMonitoringStore = defineStore('monitoring', () => {
    const { $supabase } = useNuxtApp()
    const { dateToday, start, end} = useDate()
    const userMonitoring = ref<UserPositionHistory[]>([])
    const userPositionHistory = ref<PositionHistory[]>([])
    const userActivities = ref<UserActivity[]>([])
    const vReimbursementsSummary = ref<VReimbursementSummary | null>(null)
    const reimbursementsToday = ref<any[]>([])
    
    async function fetchUserMonitoring() {
        const { data, error } = await $supabase
            .from(V_TABLE_USER_POSITION_HISTORY)
            .select('*')
        if (error) {
            console.log(error)
            return
        }
        userMonitoring.value = data ?? []
    }

    
    const fetchUserPositionHistoryToday = async (userId: string): Promise<void> => {
        const { data, error } = await $supabase
            .from(TABLE_USER_POSITION_HISTORY)
            .select('*')
            .eq('user_id', userId)
            .gte('created_at', start.value)
            .lt('created_at', end.value)
        
        if (error) {
            console.log(error)
            return
        }
        userPositionHistory.value = data ?? []
    }

    const fetchVReimbursementsSummary = async (userId: string): Promise<void> => {
        const { data, error } = await $supabase
            .from(V_TABLE_REIMBURSEMENT)
            .select('*')
            .eq('user_id', userId)
            .eq('date', dateToday.value)
            .single()
        
        if (error) {
            console.log(error)
            return
        }
        vReimbursementsSummary.value = data ?? null
    }
    
    const fetchReimbursements = async (userId: string): Promise<void> => {
        const { data, error } = await $supabase
            .from(V_TABLE_REIMBURSEMENT_LIST)
            .select('*')
            .eq('user_id', userId)
            .gte('created_at', start.value)
            .lt('created_at', end.value)
            .order('created_at', { ascending: false })
        if (error) {
            console.log(error)
            return
        }
        reimbursementsToday.value = data ?? []
    }

    const fetchUserActivities = async (userId: string): Promise<void> => {
        const { data, error } = await $supabase
            .from(TABLE_USER_ACTIVITY)
            .select('*')
            .eq('user_id', userId)
            .gte('created_at', start.value)
            .lt('created_at', end.value)
        
        if (error) {
            console.log(error)
            return
        }
        userActivities.value = data ?? []
    }

    const fetchInformationVisit = async (id: string): Promise<{ visit: Tiket, visitiImages: VisitImage[], reimbursements: ReimbursementStore[] }> => {
        const { data: visit } = await $supabase
            .from(TABLE_TIKET)
            .select('*')
            .eq('id', id)
            .single()
        
        const { data: visitiImages } = await $supabase
            .from(TABLE_VISIT_IMAGE)
            .select('*')
            .eq('visit_id', id)
        
        const { data: reimbursements} = await $supabase
            .from(TABLE_REIMBURSEMENT_STORE)
            .select('*')
            .eq('visit_id', id)
        
        return {
            visit: visit ?? {},
            visitiImages: visitiImages ?? [],
            reimbursements: reimbursements ?? [],
        }
    }

    const fetchInformationReimbursement = async (id: string): Promise<{ reimbursements: any }> => {
        const { data: reimbursements} = await $supabase
            .from(V_TABLE_REIMBURSEMENT_LIST)
            .select('*')
            .eq('id', id)
        
        return {
            reimbursements: reimbursements ?? {},
        }
    }
    
    const fetchInformationOrder = async (orderId: string): Promise<{ order: any, products: any[] }> => {
        const { data: order } = await $supabase
            .from(TABLE_ORDER)
            .select('*')
            .eq('order_id', orderId)
            .single()
        
        const { data: products } = await $supabase
            .from(TABLE_ORDER_PRODUCT)
            .select('*')
            .eq('order_id', orderId)
        
        return {
            order: order ?? {},
            products: products ?? [],
        }
    }

    const clearDataMonitoring = async () => {
        userMonitoring.value = []
        userPositionHistory.value = []
        userActivities.value = []
        vReimbursementsSummary.value = null
        reimbursementsToday.value = []
    }

    return {
        userMonitoring,
        userPositionHistory,
        userActivities,
        vReimbursementsSummary,
        reimbursementsToday,
        fetchUserMonitoring,
        fetchUserPositionHistoryToday,
        fetchVReimbursementsSummary,
        fetchReimbursements,
        fetchUserActivities,
        clearDataMonitoring,
        fetchInformationVisit,
        fetchInformationReimbursement,
        fetchInformationOrder,
    }
})
