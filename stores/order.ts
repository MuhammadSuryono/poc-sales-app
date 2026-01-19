import { defineStore } from 'pinia'
import { sampleOrders, sampleProducts, type Cart, type CartProduct, type Order, type PaymentType, type Product } from '~/types/product'

export const useOrderStore = defineStore('order', {
  state: () => ({ 
    products: sampleProducts as Product[],
    charts: [] as Cart[],
    orders: sampleOrders as Order[]
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
      const existingProduct = currentCart.Products.find(p => p.Code === product.Code);

      if (existingProduct) {
        existingProduct.Quantity += 1;
        existingProduct.Total += product.Price;
        existingProduct.Timestamp = new Date().toISOString();
      } else {
        currentCart.Products.push({
          ...product,
          Quantity: 1,
          Total: product.Price,
          Timestamp: new Date().toISOString()
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
          total += (p.Price * (1 - p.Discount / 100)) * p.Quantity
        }
      }
      return total
    },
    getTotalQuantity(customerNo: string) {
      return this.getCartCustomerActive(customerNo)?.Products?.reduce((sum, p) => sum + p.Quantity, 0) ?? 0
    },
    async createOrder(customerNo: string, paymentMethod: PaymentType, note?: string) {
      const cartActive = this.getCartCustomerActive(customerNo)
      const order : Order = {
        CustomerNo: customerNo,
        Note: note,
        PaymentMethod: paymentMethod,
        OrderId: `${Date.now()}`,
        Products: cartActive?.Products,
        Status: 'WAITING',
        TotalPrice: this.getTotalPriceCart(customerNo),
        TotalQuantity: this.getTotalQuantity(customerNo)
      }
      this.orders.push(order)

       // Set timeout untuk ubah status jadi APPROVED setelah 15 detik
      setTimeout(() => {
        const foundOrder = this.orders.find(o => o.OrderId === order.OrderId)
        if (foundOrder && foundOrder.Status === 'WAITING') {
          foundOrder.Status = 'APPROVED'
        }
      }, 15000)
    }
  }
})
