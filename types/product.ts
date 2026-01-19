export interface Product {
    Code: string,
    Name: string,
    Discount: number, // in percentage
    Price: number,
    Image: string,
    Stok: number
}

export interface CartProduct extends Product {
    Timestamp?: string,
    Quantity?: number,
    Total?: number
}

export type CartStatus = 'ACTIVE' | 'CHECKOUT'
export type PaymentType = 'CASH' | 'TRANSFER' | 'QRIS'

export interface Cart {
    CustomerNo: string,
    Status: CartStatus,
    Products: CartProduct[]
}

export interface Order {
    CustomerNo: string,
    OrderId: string,
    TotalQuantity: number,
    TotalPrice: number,
    TotalDisc?: number,
    Status: string,
    Note?: string,
    PaymentMethod: PaymentType,
    Products: CartProduct[] | undefined | null
}

export const sampleProducts: Product[] = [
  {
    "Code": "PRD-001",
    "Name": "Minyak Goreng Bimoli 1L",
    "Discount": 10,
    "Price": 15000,
    "Image": "https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full/catalog-image/106/MTA-157255890/bimoli_minyak-goreng-bimoli-1l_full01.jpg",
    "Stok": 100
  },
  {
    "Code": "PRD-002",
    "Name": "Beras Setra Ramos 5kg",
    "Discount": 5,
    "Price": 70000,
    "Image": "https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full/catalog-image/90/MTA-154604032/befood_befood_beras_prem_setra_ramos_5kg_full01_f2hb19pw.jpg",
    "Stok": 40
  },
  {
    "Code": "PRD-003",
    "Name": "Indomie Goreng 1 Dus",
    "Discount": 15,
    "Price": 115000,
    "Image": "https://images.tokopedia.net/img/cache/700/VqbcmM/2023/4/13/3777c402-64a7-4d36-86e7-016a1a637d3a.png",
    "Stok": 75
  },
  {
    "Code": "PRD-004",
    "Name": "Susu UHT Frisian Flag 1L",
    "Discount": 0,
    "Price": 18000,
    "Image": "https://images.tokopedia.net/img/cache/700/hDjmkQ/2023/11/30/5fcbd264-1431-40c0-8666-1ba24f1786db.jpg",
    "Stok": 60
  },
  {
    "Code": "PRD-005",
    "Name": "Teh Pucuk Harum 350ml",
    "Discount": 20,
    "Price": 3500,
    "Image": "https://img.lazcdn.com/g/ot/lzd-client-service/c2dcfe44050a22786082e5d43c4b541a.jpeg_720x720q80.jpg",
    "Stok": 150
  },
  {
    "Code": "PRD-006",
    "Name": "Kopi Kapal Api Special 165g",
    "Discount": 8,
    "Price": 10500,
    "Image": "https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//92/MTA-21860073/kapal_api_kopi_bubuk_kapal_api_special_165_gr_full01_eb8a8425.jpg",
    "Stok": 90
  },
  {
    "Code": "PRD-007",
    "Name": "Rinso Deterjen Cair 1.4L",
    "Discount": 12,
    "Price": 26000,
    "Image": "https://images.tokopedia.net/img/cache/700/VqbcmM/2024/7/3/52e75115-3ad0-42fc-9253-a751d99b951f.jpg",
    "Stok": 50
  },
  {
    "Code": "PRD-008",
    "Name": "Lifebuoy Sabun Cair 450ml",
    "Discount": 7,
    "Price": 18000,
    "Image": "https://images.tokopedia.net/img/cache/500-square/VqbcmM/2022/1/21/d4a6dd58-9045-43fe-b06b-8d8d422ae894.jpg",
    "Stok": 120
  }
]

export const sampleOrders: Order[] = [
  {
    CustomerNo: "MB00001",
    OrderId: "ORD-001",
    TotalQuantity: 2,
    TotalPrice: 27000,
    TotalDisc: 3000,
    Status: "WAITING",
    Note: "Menunggu pembayaran transfer",
    PaymentMethod: "TRANSFER",
    Products: [
      {
        ...sampleProducts[0], // Minyak Goreng Bimoli
        Timestamp: "2025-07-16T08:00:00Z",
        Quantity: 1,
        Total: 13500 // 15000 - 10%
      },
      {
        ...sampleProducts[5], // Kopi Kapal Api
        Timestamp: "2025-07-16T08:01:00Z",
        Quantity: 1,
        Total: 9450 // 10500 - 10%
      }
    ]
  },
  {
    CustomerNo: "MB00002",
    OrderId: "ORD-002",
    TotalQuantity: 3,
    TotalPrice: 209050,
    TotalDisc: 16950,
    Status: "APPROVED",
    Note: "Pembayaran via QRIS berhasil",
    PaymentMethod: "QRIS",
    Products: [
      {
        ...sampleProducts[2], // Indomie Goreng 1 Dus
        Timestamp: "2025-07-16T09:00:00Z",
        Quantity: 1,
        Total: 97750 // 115000 - 15%
      },
      {
        ...sampleProducts[3], // Susu UHT
        Timestamp: "2025-07-16T09:01:00Z",
        Quantity: 1,
        Total: 18000
      },
      {
        ...sampleProducts[4], // Teh Pucuk
        Timestamp: "2025-07-16T09:02:00Z",
        Quantity: 3,
        Total: 8400 // 3500 x 3 - 20%
      }
    ]
  },
  {
    CustomerNo: "MB00003",
    OrderId: "ORD-003",
    TotalQuantity: 2,
    TotalPrice: 89380,
    TotalDisc: 9400,
    Status: "COMPLETED",
    Note: "Pesanan sudah diterima oleh pelanggan",
    PaymentMethod: "CASH",
    Products: [
      {
        ...sampleProducts[1], // Beras Setra Ramos
        Timestamp: "2025-07-16T10:00:00Z",
        Quantity: 1,
        Total: 66500 // 70000 - 5%
      },
      {
        ...sampleProducts[6], // Rinso
        Timestamp: "2025-07-16T10:01:00Z",
        Quantity: 1,
        Total: 22900 // 26000 - 12%
      }
    ]
  }
];

