import { defineStore } from "pinia"
import type { Product } from "~/types/product"
import { TABLE_PRODUCT } from "~/types/table"

export const useProductStore = defineStore('product', () => {
    const { $supabase } = useNuxtApp()
    const products = ref<Product[]>([])

    const fetchAllProducts = async () => {
        const { data, error } = await $supabase
            .from(TABLE_PRODUCT)
            .select('*')
        if (error) {
            console.log(error)
            return
        }
        products.value = data ?? []
    }

    return {
        products,
        fetchAllProducts
    }
})