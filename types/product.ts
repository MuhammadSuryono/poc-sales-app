export interface Product {
    code: string,
    name: string,
    discount: number, // in percentage
    price: number,
    image: string,
    stok: number
}

export interface CartProduct extends Product {
    timestamp?: string,
    quantity?: number,
    total?: number
}

export type CartStatus = 'ACTIVE' | 'CHECKOUT'
export type PaymentType = 'CASH' | 'TRANSFER' | 'QRIS'

export interface Cart {
    CustomerNo: string,
    Status: CartStatus,
    Products: CartProduct[]
}

export interface Order {
    customer_no: string,
    visit_id?: string,
    order_id: string,
    total_quantity: number,
    total_price: number,
    total_disc?: number,
    status: string,
    note?: string,
    payment_method: PaymentType,
    products: CartProduct[] | undefined | null
}

export const sampleProducts: Product[] = [];

export const sampleOrders: Order[] = [];

