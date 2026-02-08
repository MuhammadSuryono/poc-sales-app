import { defineStore } from 'pinia'
import { sampleOrders, sampleProducts, type Cart, type CartProduct, type Order, type PaymentType, type Product } from '~/types/product'
import { TABLE_ORDER, TABLE_ORDER_PRODUCT } from '~/types/table'
import { useUserStore } from './user'
import type { UserActivity } from '~/types/user'

export const useOrderStore = defineStore('order', {
  state: () => ({ 
    products: sampleProducts as Product[],
    charts: [] as Cart[],
    orders: [] as Order[]
  }),
  actions: {
    getCartCustomerActive(customerNo: string) {
      if (this.charts) {
        const cartCustomer = this.charts?.find(c => c.CustomerNo === customerNo && c.Status === 'ACTIVE')
        if (cartCustomer) {
          return cartCustomer
        }
      }
      return null
    },
    getOrderCustomer(customerNo: string) {
      if (this.charts) {
        const orderCustomer = this.orders?.filter(c => c.CustomerNo === customerNo)
        if (orderCustomer) {
          return orderCustomer
        }
      }
      return null
    },
    addToCart(customerNo: string, product: Product) {
      let currentCart = this.getCartCustomerActive(customerNo)
      
      if (!currentCart) {
        currentCart = {
          CustomerNo: customerNo,
          Status: 'ACTIVE',
          Products: [] as CartProduct[]
        } as Cart
        this.charts?.push(currentCart)
      }
      if (!currentCart.Products) {
        currentCart.Products = [];
      }
      const existingProduct = currentCart.Products.find(p => p.code === product.code);

      if (existingProduct) {
        existingProduct.quantity += 1;
        existingProduct.total += product.price;
        existingProduct.timestamp = new Date().toISOString();
      } else {
        currentCart.Products.push({
          ...product,
          quantity: 1,
          total: product.price,
          timestamp: new Date().toISOString()
        });
      }
    },
    getTotalCartCustomer(customerNo: string) {
      return this.getCartCustomerActive(customerNo)?.Products?.length ?? 0
    },
    getTotalPriceCart(customerNo: string) {
      const cartCustomer = this.getCartCustomerActive(customerNo)
      let total = 0
      if (cartCustomer) {
        for(const p of cartCustomer.Products) {
          total += (p.price * (1 - p.discount / 100)) * p.quantity
        }
      }
      return total
    },
    getTotalQuantity(customerNo: string) {
      return this.getCartCustomerActive(customerNo)?.Products?.reduce((sum, p) => sum + p.quantity, 0) ?? 0
    },
    async fetchOrder(customerNo: string) {
      const { $supabase } = useNuxtApp()
      const { data, error } = await $supabase
        .from(TABLE_ORDER)
        .select('*')
        .eq('customer_no', customerNo)
        .order('created_at', { ascending: false })
      if (data) {
        const { data: productItems } = await $supabase
          .from(TABLE_ORDER_PRODUCT)
          .select(`
            *,
            products (
              code,
              name,
              price,
              image
            )`)
          .in('order_id', data.map(o => o.order_id))

        if (productItems) {
          for(const o of data) {
            o.products = productItems.filter(p => p.order_id === o.order_id)
          }
        }
        this.orders = data as Order[]
      }
    },
    async createOrder(customerNo: string, paymentMethod: PaymentType, note?: string) {
      const cartActive = this.getCartCustomerActive(customerNo)
      const order : Order = {
        customer_no: customerNo,
        note: note,
        payment_method: paymentMethod,
        order_id: `${Date.now()}`,
        products: cartActive?.Products,
        status: 'WAITING',
        total_price: this.getTotalPriceCart(customerNo),
        total_quantity: this.getTotalQuantity(customerNo)
      }

      const { $supabase } = useNuxtApp()
      const userStore = useUserStore()

      const id = useUseString().uuidv4()
      await $supabase
        .from(TABLE_ORDER)
        .insert({
          order_id: id,
          customer_no: customerNo,
          // visit_id: cartActive?.VisitId,
          total_quantity: order.total_quantity,
          total_discount: order.total_disc,
          total_price: order.total_price,
          status: order.status,
          note: order.note,
          payment_method: order.payment_method,
        })
      
      for(const p of order.products ?? []) {
        await $supabase
          .from(TABLE_ORDER_PRODUCT)
          .insert({
            order_id: id,
            product_code: p.code,
            quantity: p.quantity,
            unit_price: p.price,
            discount: p.discount,
            total: p.total,
          })
      }
      await userStore.addUserActivity({
        user_id: userStore.user?.user_id as string,
        id_related: id,
        category: 'ORDER',
        description: `Pembelian ${order.total_quantity} item dengan total harga Rp ${useUseString().setNumberFormat(order.total_price)}`,
        timestamp: new Date().toISOString(),
      }as UserActivity)
      
      await this.fetchOrder(customerNo)
    },
    async fethOrderInformation(orderId: string) {
      const { $supabase } = useNuxtApp()
      const { data: dataOrder, error } = await $supabase
        .from(TABLE_ORDER)
        .select('*')
        .eq('order_id', orderId)
        .single()
      
      const { data: productItems } = await $supabase
        .from(TABLE_ORDER_PRODUCT)
        .select(`
          *,
          products (
            code,
            name,
            price,
            image
          )`)
        .eq('order_id', orderId)
      
      return {
        order: dataOrder,
        products: productItems,
      }
    }
  }
})
