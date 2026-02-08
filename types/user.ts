type VisitStatusType = 'TODO' | 'INPROGRESS' | 'FINISH'
export interface Tiket {
  id: string,
  customer_no: string,
  customer_name: string,
  customer_phone: string,
  badan_usaha: string,
  alamat: string,
  alamat2?: string,
  identity_number?: string,
  balance: number,
  balance_credit: number,
  status: string,
  visit_status: VisitStatusType,
  lat: number,
  lng: number,
  last_updated: string,
  visit_date?: string,
  visit_time?: string,
  visit_address?: string,
  visit_note?: string,
  visit_lat?: number,
  visit_lng?: number,
  visit_last_updated?: string,
  visit_check_in?: string,
  visit_check_out?: string,
  visit_duration?: string,
  visit_distance?: number,
  visit_payment?: string,
  user_id: string
}

export type RoleType = 'SALES' | 'COLLECTOR' | 'SUPERVISOR' | 'ADMIN'
export interface User {
  user_id: string,
  name: string,
  email: string,
  password: string,
  role: RoleType,
  profile: string,
  currentPosition: number[],
  positionHistory: PositionHistory[],
  userActivities: UserActivity[],
  reimbursementsGeneral?: Reimbursement[]
}

export interface UserPositionHistory extends User {
  current_position_lat: number,
  current_position_lng: number,
  last_position_date: string,
}

export interface PositionHistory {
  user_id: string,
  lat: number,
  lng: number,
  locationName?: string,
  timestamp: string,
  created_at?: string,
}

export type UserActivityCategoryType = 'LOGIN' | 'ORDER' | 'VISIT' | 'REIMBURSEMENT'
export interface UserActivity {
  id_related: string,
  user_id: string,
  category: UserActivityCategoryType,
  description: string,
  timestamp: string,
  created_at?: string,
}

export interface VisitHistory extends Tiket {
  user_visit_name: string,
  // userVisitEmail: string
}

export interface StatisticUserToday {
  IdSales: string,
  TotalCustomer: number,
  totalTransaction: number,
}

export interface HistoryTransaction {
  invoice_no: string,
  order_date: string,
  posting_date: string,
  amount: number,
  customer_id: string,
  type: string
}

export interface StatisticStore {
  customerId: string,
  totalItems: number,
  totalSales: number
}

export interface Noo {
  customerName: string,
  contact: string,
  addres?: string,
  lat?: number,
  lng?: number
}

export const sampleDataNoo: Noo[] = [
  {
    customerName: 'Toko jaya sukses',
    contact: '08121321212',
    addres: 'JPJQ+7X3, Serua, Kec. Bojongsari, Kota Depok, Jawa Barat 16517',
    lat: -6.3691664,
    lng: 106.7400738
  }
]

export const sampleHistoryTransaction: HistoryTransaction[] = [
  {
    invoiceNo: 'INV-00001',
    orderDate: '2025-07-14T14:00:00',
    postingDate: '2025-07-15T10:00:00',
    amount: 89380,
    customerId: 'MB00003',
    type: 'ORDER'
  }
]

export const sampleStatisticUser: StatisticUserToday[] = [
  {
    IdSales: "collector",
    TotalCustomer: 0,
    totalTransaction: 0
  },
  {
    IdSales: "sales",
    TotalCustomer: 0,
    totalTransaction: 0
  }
]

export const sampleUserLogin: User[] = [
  {
    userId: 'sales',
    name: 'Albert Kurniawan',
    email: 'sales@mail.com',
    password: '123456',
    role: 'SALES',
    profile:
      'https://static.vecteezy.com/system/resources/thumbnails/058/270/914/small/confident-business-professional-holding-digital-devices-in-office-png.png',
    currentPosition: [-6.305, 106.813],
    positionHistory: [
      {
        lat: -6.229728,
        lng: 106.829518,
        locationName: 'Kuningan City Mall',
        timestamp: '2025-01-26T08:00:00',
      },
      {
        lat: -6.17511,
        lng: 106.865039,
        locationName: 'Stasiun Jatinegara',
        timestamp: '2025-01-26T08:15:00',
      },
      {
        lat: -6.1229,
        lng: 106.7742,
        locationName: 'Pluit Village Mall',
        timestamp: '2025-01-26T08:30:00',
      },
      {
        lat: -6.208763,
        lng: 106.845599,
        locationName: 'Taman Suropati (Menteng)',
        timestamp: '2025-01-26T08:45:00',
      },
      {
        lat: -6.305,
        lng: 106.813,
        locationName: 'Cilandak Town Square (CITOS)',
        timestamp: '2025-01-26T09:00:00',
      },
    ],
    userActivities: [
      {
        description: 'Checkin di Toko Bangunan Jaya Maju',
        timestamp: '2025-01-26T09:10:00',
      },
    ],
    reimbursementsGeneral: [
      { date: '2025-01-26', category: 'TRANSPORT', amount: 25000, note: 'Gojek ke lokasi', status: 'WAITING', type: 'GENERAL' },
      { date: '2025-01-26', category: 'MEAL', amount: 18000, note: 'Makan siang', status: 'APPROVED', type: 'GENERAL' },
      { date: '2025-01-25', category: 'PARKING', amount: 5000, note: 'Parkir minimarket', status: 'REJECTED', type: 'GENERAL' }
    ]
  },

  {
    userId: 'collector',
    name: 'Salsabila',
    email: 'collector@mail.com',
    password: '123456',
    role: 'COLLECTOR',
    profile:
      'https://img.freepik.com/free-psd/expressive-woman-gesturing_23-2150198673.jpg',
    currentPosition: [-6.12, 106.9],
    positionHistory: [
      {
        lat: -6.2442,
        lng: 106.7996,
        locationName: 'Palmerah (Jakarta Barat)',
        timestamp: '2025-01-26T08:00:00',
      },
      {
        lat: -6.1352,
        lng: 106.8133,
        locationName: 'Kemayoran (Jakarta Pusat)',
        timestamp: '2025-01-26T08:15:00',
      },
      {
        lat: -6.2087,
        lng: 106.8456,
        locationName: 'Menteng (Jakarta Pusat)',
        timestamp: '2025-01-26T08:30:00',
      },
      {
        lat: -6.31,
        lng: 106.82,
        locationName: 'Depok - Margonda',
        timestamp: '2025-01-26T08:45:00',
      },
      {
        lat: -6.12,
        lng: 106.9,
        locationName: 'Cakung (Jakarta Timur)',
        timestamp: '2025-01-26T09:00:00',
      },
    ],
    userActivities: [
      {
        description: 'Cek list tagihan hari ini (10 nasabah)',
        timestamp: '2025-01-26T07:40:00',
      },
      {
        description: 'Penagihan ke Nasabah A (status: janji bayar)',
        timestamp: '2025-01-26T08:12:00',
      },
      {
        description: 'Upload bukti kunjungan & catatan penagihan',
        timestamp: '2025-01-26T08:20:00',
      },
      {
        description: 'Penagihan ke Nasabah B (status: bayar sebagian)',
        timestamp: '2025-01-26T08:38:00',
      },
      {
        description: 'Update status pembayaran ke sistem',
        timestamp: '2025-01-26T08:52:00',
      },
      {
        description: 'Penagihan ke Nasabah C (status: tidak ditemui)',
        timestamp: '2025-01-26T09:05:00',
      },
    ],
    reimbursementsGeneral: [
      { date: '2025-01-24', category: 'TRANSPORT', amount: 30000, note: 'Busway ke lokasi', status: 'WAITING', type: 'GENERAL' }
    ]
  },

  {
    userId: 'sales2',
    name: 'Dimas Pratama',
    email: 'dimas@mail.com',
    password: '123456',
    role: 'SALES',
    profile:
      'https://img.freepik.com/free-photo/young-handsome-man-with-beard-isolated_273609-30034.jpg',
    currentPosition: [-6.238, 106.985],
    positionHistory: [
      {
        lat: -6.1751,
        lng: 106.865,
        locationName: 'Jatinegara Trade Center',
        timestamp: '2025-01-26T08:00:00',
      },
      {
        lat: -6.1229,
        lng: 106.7742,
        locationName: 'Pluit (Jakarta Utara)',
        timestamp: '2025-01-26T08:15:00',
      },
      {
        lat: -6.1931,
        lng: 106.8218,
        locationName: 'Bundaran HI',
        timestamp: '2025-01-26T08:30:00',
      },
      {
        lat: -6.238,
        lng: 106.985,
        locationName: 'Bekasi - Summarecon Mall',
        timestamp: '2025-01-26T08:45:00',
      },
      {
        lat: -6.2087,
        lng: 106.8456,
        locationName: 'Menteng (Jakarta)',
        timestamp: '2025-01-26T09:00:00',
      },
    ],
    userActivities: [
      {
        description: 'Meeting dengan customer existing (renewal kontrak)',
        timestamp: '2025-01-26T07:55:00',
      },
      {
        description: 'Kirim quotation revisi (diskon 10%)',
        timestamp: '2025-01-26T08:18:00',
      },
      {
        description: 'Prospecting: cari leads baru via Instagram',
        timestamp: '2025-01-26T08:27:00',
      },
      {
        description: 'Kunjungan ke calon customer (Bekasi)',
        timestamp: '2025-01-26T08:50:00',
      },
      {
        description: 'Follow up admin untuk proses kontrak',
        timestamp: '2025-01-26T09:05:00',
      },
    ],
    reimbursementsGeneral: []
  },

  {
    userId: 'collector2',
    name: 'Nadia Putri',
    email: 'nadia@mail.com',
    password: '123456',
    role: 'COLLECTOR',
    profile:
      'https://img.freepik.com/free-photo/portrait-smiling-young-businesswoman_23-2148814449.jpg',
    currentPosition: [-6.33, 106.67],
    positionHistory: [
      {
        lat: -6.2087,
        lng: 106.8456,
        locationName: 'Menteng - Jakarta Pusat',
        timestamp: '2025-01-26T08:00:00',
      },
      {
        lat: -6.305,
        lng: 106.813,
        locationName: 'Cilandak - Jakarta Selatan',
        timestamp: '2025-01-26T08:15:00',
      },
      {
        lat: -6.33,
        lng: 106.67,
        locationName: 'BSD City - Tangerang Selatan',
        timestamp: '2025-01-26T08:30:00',
      },
      {
        lat: -6.2297,
        lng: 106.8295,
        locationName: 'Kuningan - Jakarta Selatan',
        timestamp: '2025-01-26T08:45:00',
      },
      {
        lat: -6.1352,
        lng: 106.8133,
        locationName: 'Kemayoran - Jakarta Pusat',
        timestamp: '2025-01-26T09:00:00',
      },
    ],
    userActivities: [
      {
        description: 'Ambil dokumen penagihan di kantor (Menteng)',
        timestamp: '2025-01-26T07:50:00',
      },
      {
        description: 'Penagihan ke Nasabah D (status: bayar full)',
        timestamp: '2025-01-26T08:17:00',
      },
      {
        description: 'Cetak & upload bukti pembayaran',
        timestamp: '2025-01-26T08:25:00',
      },
      {
        description: 'Penagihan ke Nasabah E (status: janji bayar besok)',
        timestamp: '2025-01-26T08:41:00',
      },
      {
        description: 'Update catatan risiko (nasabah sering telat)',
        timestamp: '2025-01-26T08:55:00',
      },
      {
        description: 'Istirahat + makan siang lebih awal',
        timestamp: '2025-01-26T09:08:00',
      },
    ],
    reimbursementsGeneral: []
  },

  {
    userId: 'supervisor',
    name: 'Rudi Santoso',
    email: 'rudi@mail.com',
    password: '123456',
    role: 'SUPERVISOR',
    profile:
      'https://img.freepik.com/free-photo/portrait-handsome-businessman_23-2148814440.jpg',
    currentPosition: [-6.12, 106.77],
    positionHistory: [
      {
        lat: -6.1931,
        lng: 106.8218,
        locationName: 'Thamrin - Jakarta Pusat',
        timestamp: '2025-01-26T08:00:00',
      },
      {
        lat: -6.1751,
        lng: 106.865,
        locationName: 'Jatinegara - Jakarta Timur',
        timestamp: '2025-01-26T08:15:00',
      },
      {
        lat: -6.1229,
        lng: 106.7742,
        locationName: 'Pluit - Jakarta Utara',
        timestamp: '2025-01-26T08:30:00',
      },
      {
        lat: -6.2442,
        lng: 106.7996,
        locationName: 'Palmerah - Jakarta Barat',
        timestamp: '2025-01-26T08:45:00',
      },
      {
        lat: -6.12,
        lng: 106.77,
        locationName: 'PIK Avenue - Pantai Indah Kapuk',
        timestamp: '2025-01-26T09:00:00',
      },
    ],
    userActivities: [
      {
        description: 'Briefing pagi ke tim sales & collector',
        timestamp: '2025-01-26T07:35:00',
      },
      {
        description: 'Review laporan penagihan (yesterday report)',
        timestamp: '2025-01-26T08:10:00',
      },
      {
        description: 'Approval diskon khusus untuk customer besar',
        timestamp: '2025-01-26T08:28:00',
      },
      {
        description: 'Monitoring GPS tracking anggota tim',
        timestamp: '2025-01-26T08:42:00',
      },
      {
        description: 'Call evaluasi kinerja (quick check-in)',
        timestamp: '2025-01-26T09:02:00',
      },
    ],
    reimbursementsGeneral: []
  },
  {
    userId: 'admin',
    name: 'Intan Maharani',
    email: 'admin@mail.com',
    password: '123456',
    role: 'ADMIN',
    profile:
      'https://img.freepik.com/free-photo/cheerful-businesswoman-sitting-office_23-2148814455.jpg',
    currentPosition: [-6.9, 107.6],
    positionHistory: [
      {
        lat: -6.1931,
        lng: 106.8218,
        locationName: 'Thamrin - Jakarta',
        timestamp: '2025-01-26T08:00:00',
      },
      {
        lat: -6.33,
        lng: 106.67,
        locationName: 'BSD City - Tangerang Selatan',
        timestamp: '2025-01-26T08:15:00',
      },
      {
        lat: -6.238,
        lng: 106.985,
        locationName: 'Bekasi - Summarecon',
        timestamp: '2025-01-26T08:30:00',
      },
      {
        lat: -6.1229,
        lng: 106.7742,
        locationName: 'Pluit - Jakarta Utara',
        timestamp: '2025-01-26T08:45:00',
      },
      {
        lat: -6.9,
        lng: 107.6,
        locationName: 'Bandung - Dago',
        timestamp: '2025-01-26T09:00:00',
      },
    ],
    userActivities: [
      {
        description: 'Sinkron data user & reset password request',
        timestamp: '2025-01-26T07:30:00',
      },
      {
        description: 'Generate invoice untuk 3 customer baru',
        timestamp: '2025-01-26T08:05:00',
      },
      {
        description: 'Update master data produk (harga terbaru)',
        timestamp: '2025-01-26T08:20:00',
      },
      {
        description: 'Verifikasi pembayaran masuk (bank transfer)',
        timestamp: '2025-01-26T08:37:00',
      },
      {
        description: 'Rekap laporan harian untuk supervisor',
        timestamp: '2025-01-26T09:05:00',
      },
    ],
    reimbursementsGeneral: []
  },
]

export const sampleVisitHistory: VisitHistory[] = [
  {
    "customerNo": "MB00001",
    "customerName": "ROMLI",
    "customerPhone": "08696736326",
    "badanUsaha": "Retail",
    "alamat": "Jl. Contoh Alamat No. 1, Jakarta Selatan",
    "balance": 9889636,
    "balanceCredit": 558442,
    "status": "MACET",
    "visitStatus": "TODO",
    "lat": -6.368988,
    "lng": 106.740519,
    "lastUpdated": "2025-01-26T12:00:01",
    "visitDate": "2025-01-26",
    "visitTime": "14:33",
    "visitAddress": "Jl. Contoh Alamat No. 1, Jakarta Selatan (lokasi kunjungan)",
    "visitNote": "Konsumen tidak di tempat",
    "visitLat": -6.268041,
    "visitLng": 106.809833,
    "visitLastUpdated": "2025-01-20T09:20:00",
    "visitCheckIn": "2025-01-20T09:20:00",
    "visitCheckOut": "2025-01-20T09:25:00",
    "visitDuration": "5",
    "visitDistance": 5,
    "userVisitEmail": "mail@mail.com",
    "userVisitName": "Budi Suryono",
    "visitImage": {
      location: ['https://asset-2.tstatic.net/babel/foto/bank/images/Toko-kelontong-di-Pangkalpinang.jpg', 'https://asset-2.tstatic.net/babel/foto/bank/images/Toko-kelontong-di-Pangkalpinang.jpg'],
      product: ['https://www.olx.co.id/news/wp-content/uploads/2024/06/toko-kecil-di-rumah.webp']
    },
    "visitPayment": "0",
    "userId": "sales"
  },
  {
    "customerNo": "MB00001",
    "customerName": "ROMLI",
    "customerPhone": "08696736326",
    "badanUsaha": "Retail",
    "alamat": "Jl. Contoh Alamat No. 1, Jakarta Selatan",
    "balance": 9889636,
    "balanceCredit": 558442,
    "status": "MACET",
    "visitStatus": "TODO",
    "lat": -6.368988,
    "lng": 106.740519,
    "lastUpdated": "2025-01-26T12:00:01",
    "visitDate": "2025-01-26",
    "visitTime": "14:33",
    "visitAddress": "Jl. Contoh Alamat No. 1, Jakarta Selatan (lokasi kunjungan)",
    "visitNote": "Konsumen tidak di tempat",
    "visitLat": -6.268041,
    "visitLng": 106.809833,
    "visitLastUpdated": "2025-01-20T09:20:00",
    "visitCheckIn": "2025-03-20T09:20:00",
    "visitCheckOut": "2025-03-20T10:00:00",
    "visitDuration": "5",
    "visitDistance": 5,
    "userVisitEmail": "mail@mail.com",
    "userVisitName": "Bagas Sudiatmiko",
    "visitImage": {
      location: ['https://asset-2.tstatic.net/babel/foto/bank/images/Toko-kelontong-di-Pangkalpinang.jpg', 'https://asset-2.tstatic.net/babel/foto/bank/images/Toko-kelontong-di-Pangkalpinang.jpg'],
      product: ['https://www.olx.co.id/news/wp-content/uploads/2024/06/toko-kecil-di-rumah.webp']
    },
    "visitPayment": "0",
    "userId": "sales"
  },
  {
    "customerNo": "MB00003",
    "customerName": "ROMLI",
    "customerPhone": "08696736326",
    "badanUsaha": "Retail",
    "alamat": "Jl. Contoh Alamat No. 1, Jakarta Selatan",
    "balance": 9889636,
    "balanceCredit": 558442,
    "status": "MACET",
    "visitStatus": "TODO",
    "lat": -6.368988,
    "lng": 106.740519,
    "lastUpdated": "2025-01-26T12:00:01",
    "visitDate": "2025-07-01T09:20:00",
    "visitTime": "14:33",
    "visitAddress": "Jl. Contoh Alamat No. 1, Jakarta Selatan (lokasi kunjungan)",
    "visitNote": "Tolong kembali di minggu depan, karena saat ini stok barang masih ada",
    "visitLat": -6.268041,
    "visitLng": 106.809833,
    "visitLastUpdated": "2025-01-20T09:20:00",
    "visitCheckIn": "2025-07-01T09:20:00",
    "visitCheckOut": "2025-07-01T10:00:00",
    "visitDuration": "5",
    "visitDistance": 5,
    "userVisitEmail": "mail@mail.com",
    "userVisitName": "Bagas Sudiatmiko",
    "visitImage": {
      location: ['https://asset-2.tstatic.net/babel/foto/bank/images/Toko-kelontong-di-Pangkalpinang.jpg', 'https://asset-2.tstatic.net/babel/foto/bank/images/Toko-kelontong-di-Pangkalpinang.jpg'],
      product: ['https://www.olx.co.id/news/wp-content/uploads/2024/06/toko-kecil-di-rumah.webp']
    },
    "visitPayment": "0",
    "userId": "sales"
  },
  {
    "customerNo": "MB00005",
    "customerName": "ROMLI",
    "customerPhone": "08696736326",
    "badanUsaha": "Retail",
    "alamat": "Jl. Contoh Alamat No. 1, Jakarta Selatan",
    "balance": 9889636,
    "balanceCredit": 558442,
    "status": "MACET",
    "visitStatus": "TODO",
    "lat": -6.368988,
    "lng": 106.740519,
    "lastUpdated": "2025-01-26T12:00:01",
    "visitDate": "2025-03-20T09:20:00",
    "visitTime": "14:33",
    "visitAddress": "Jl. Contoh Alamat No. 1, Jakarta Selatan (lokasi kunjungan)",
    "visitNote": "Konsumen tidak di tempat",
    "visitLat": -6.268041,
    "visitLng": 106.809833,
    "visitLastUpdated": "2025-01-20T09:20:00",
    "visitCheckIn": "2025-03-20T09:20:00",
    "visitCheckOut": "2025-03-20T10:00:00",
    "visitDuration": "5",
    "visitDistance": 5,
    "userVisitEmail": "mail@mail.com",
    "userVisitName": "Bagas Sudiatmiko",
    "visitImage": {
      location: ['https://asset-2.tstatic.net/babel/foto/bank/images/Toko-kelontong-di-Pangkalpinang.jpg', 'https://asset-2.tstatic.net/babel/foto/bank/images/Toko-kelontong-di-Pangkalpinang.jpg'],
      product: ['https://www.olx.co.id/news/wp-content/uploads/2024/06/toko-kecil-di-rumah.webp']
    },
    "visitPayment": "0",
    "userId": "sales"
  },
  {
    "customerNo": "MB00003",
    "customerName": "ROMLI",
    "customerPhone": "08696736326",
    "badanUsaha": "Retail",
    "alamat": "Jl. Contoh Alamat No. 1, Jakarta Selatan",
    "balance": 9889636,
    "balanceCredit": 558442,
    "status": "MACET",
    "visitStatus": "TODO",
    "lat": -6.368988,
    "lng": 106.740519,
    "lastUpdated": "2025-01-26T12:00:01",
    "visitDate": "2025-07-07T09:20:00",
    "visitTime": "14:33",
    "visitAddress": "Jl. Contoh Alamat No. 1, Jakarta Selatan (lokasi kunjungan)",
    "visitNote": "Konsumen tidak di tempat",
    "visitLat": -6.268041,
    "visitLng": 106.809833,
    "visitLastUpdated": "2025-01-20T09:20:00",
    "visitCheckIn": "2025-07-07T09:20:00",
    "visitCheckOut": "2025-07-07T10:00:00",
    "visitDuration": "5",
    "visitDistance": 5,
    "userVisitEmail": "mail@mail.com",
    "userVisitName": "Bagas Sudiatmiko",
    "visitImage": {
      location: ['https://asset-2.tstatic.net/babel/foto/bank/images/Toko-kelontong-di-Pangkalpinang.jpg', 'https://asset-2.tstatic.net/babel/foto/bank/images/Toko-kelontong-di-Pangkalpinang.jpg'],
      product: ['https://www.olx.co.id/news/wp-content/uploads/2024/06/toko-kecil-di-rumah.webp']
    },
    "visitPayment": "0",
    "userId": "sales"
  },
  {
    "customerNo": "MB00003",
    "customerName": "ROMLI",
    "customerPhone": "08696736326",
    "badanUsaha": "Retail",
    "alamat": "Jl. Contoh Alamat No. 1, Jakarta Selatan",
    "balance": 9889636,
    "balanceCredit": 558442,
    "status": "MACET",
    "visitStatus": "TODO",
    "lat": -6.368988,
    "lng": 106.740519,
    "lastUpdated": "2025-01-26T12:00:01",
    "visitDate": "2025-07-14T13:20:00",
    "visitTime": "14:33",
    "visitAddress": "Jl. Contoh Alamat No. 1, Jakarta Selatan (lokasi kunjungan)",
    "visitNote": "Konsumen minta datang kembali tanggal 19 Juli 2025 hari sabtu",
    "visitLat": -6.268041,
    "visitLng": 106.809833,
    "visitLastUpdated": "2025-01-20T09:20:00",
    "visitCheckIn": "2025-07-14T13:20:00",
    "visitCheckOut": "2025-07-14T14:00:00",
    "visitDuration": "5",
    "visitDistance": 5,
    "userVisitEmail": "mail@mail.com",
    "userVisitName": "Bagas Sudiatmiko",
    "visitImage": {
      location: ['https://asset-2.tstatic.net/babel/foto/bank/images/Toko-kelontong-di-Pangkalpinang.jpg', 'https://asset-2.tstatic.net/babel/foto/bank/images/Toko-kelontong-di-Pangkalpinang.jpg'],
      product: ['https://www.olx.co.id/news/wp-content/uploads/2024/06/toko-kecil-di-rumah.webp']
    },
    "visitPayment": "0",
    "userId": "sales"
  },
  {
    "customerNo": "MB00004",
    "customerName": "ROMLI",
    "customerPhone": "08696736326",
    "badanUsaha": "Retail",
    "alamat": "Jl. Contoh Alamat No. 1, Jakarta Selatan",
    "balance": 9889636,
    "balanceCredit": 558442,
    "status": "MACET",
    "visitStatus": "TODO",
    "lat": -6.368988,
    "lng": 106.740519,
    "lastUpdated": "2025-01-26T12:00:01",
    "visitDate": "2025-01-26",
    "visitTime": "14:33",
    "visitAddress": "Jl. Contoh Alamat No. 1, Jakarta Selatan (lokasi kunjungan)",
    "visitNote": "Konsumen tidak di ambil barang",
    "visitLat": -6.268041,
    "visitLng": 106.809833,
    "visitLastUpdated": "2025-01-20T09:20:00",
    "visitCheckIn": "2025-02-15T09:20:00",
    "visitCheckOut": "2025-02-15T10:00:00",
    "visitDuration": "5",
    "visitDistance": 5,
    "userVisitEmail": "mail@mail.com",
    "userVisitName": "Bagas Sudiatmiko",
    "visitImage": {
      location: ['https://asset-2.tstatic.net/babel/foto/bank/images/Toko-kelontong-di-Pangkalpinang.jpg', 'https://asset-2.tstatic.net/babel/foto/bank/images/Toko-kelontong-di-Pangkalpinang.jpg'],
      product: ['https://www.olx.co.id/news/wp-content/uploads/2024/06/toko-kecil-di-rumah.webp']
    },
    "visitPayment": "0",
    "userId": "sales"
  }
]

export const sampleTiket: Tiket[] = [
  {
    customerNo: "MB00001",
    customerName: "Toko Bangunan BSD Jaya",
    customerPhone: "08696736326",
    badanUsaha: "Retail",
    alamat:
      "Jl. Pahlawan Seribu No.8A, RT.001/RW.4, Lengkong Gudang, Kec. Serpong, Kota Tangerang Selatan, Banten 15310",
    balance: 9889636,
    balanceCredit: 558442,
    status: "MACET",
    visitStatus: "TODO",
    lat: -6.2908045,
    lng: 106.666131,
    lastUpdated: "2025-01-26T12:00:01",
    visitDate: "2025-01-26",
    visitTime: "14:33",
    visitAddress:
      "Jl. Pahlawan Seribu No.8A, RT.001/RW.4, Lengkong Gudang, Kec. Serpong, Kota Tangerang Selatan, Banten 15310 (lokasi kunjungan)",
    visitNote: "Konsumen tidak di tempat",
    visitLat: -6.268041,
    visitLng: 106.809833,
    visitLastUpdated: "2025-01-20T09:20:00",
    visitDistance: 0,
    visitPayment: "20000",
    userId: "sales",
  },
  {
    customerNo: "MB00002",
    customerName: "Toko Material Bu Ade",
    customerPhone: "08936358837",
    badanUsaha: "Kuliner",
    alamat: "Jl. Contoh Alamat No. 2, Jakarta Selatan",
    balance: 4511358,
    balanceCredit: 417377,
    status: "LANCAR",
    visitStatus: "TODO",
    lat: -6.268259,
    lng: 106.805113,
    lastUpdated: "2025-01-24T10:00:01",
    visitDate: "2025-01-24",
    visitTime: "",
    visitAddress: "",
    visitNote: "Diterima dengan baik",
    visitLat: -6.36921,
    visitLng: 106.740619,
    visitLastUpdated: "2025-01-20T08:09:00",
    visitDistance: 0,
    visitPayment: "0",
    userId: "sales",
  },
  {
    customerNo: "MB00003",
    customerName: "Toko Besi & Baja Ari",
    customerPhone: "08514371018",
    badanUsaha: "Retail",
    alamat: "Jl. Contoh Alamat No. 3, Jakarta Selatan",
    balance: 89380,
    balanceCredit: 599423,
    status: "LANCAR",
    visitStatus: "TODO",
    lat: -6.589647,
    lng: 106.790749,
    lastUpdated: "2025-01-20T12:00:01",
    visitDate: "2025-07-14T13:20:00",
    visitTime: "14:24",
    visitAddress:
      "Jl. Contoh Alamat No. 3, Jakarta Selatan (lokasi kunjungan)",
    visitNote: "",
    visitLat: -6.259896,
    visitLng: 106.802104,
    visitLastUpdated: "2025-01-20T09:14:00",
    visitCheckIn: "2025-07-13T09:09:00",
    visitDistance: 0,
    visitPayment: "0",
    userId: "sales",
  },
  {
    customerNo: "MB00004",
    customerName: "Toko Keramik 41",
    customerPhone: "08842089407",
    badanUsaha: "Kuliner",
    alamat: "Jl. Contoh Alamat No. 4, Jakarta Selatan",
    balance: 11027334,
    balanceCredit: 658966,
    status: "LANCAR",
    visitStatus: "TODO",
    lat: -6.233923,
    lng: 106.802105,
    lastUpdated: "2025-01-22T14:00:01",
    visitDate: "2025-01-22",
    visitTime: "15:27",
    visitAddress:
      "Jl. Contoh Alamat No. 4, Jakarta Selatan (lokasi kunjungan)",
    visitNote: "Diterima dengan baik",
    visitLat: -6.369121,
    visitLng: 106.740472,
    visitLastUpdated: "2025-01-20T09:49:00",
    visitDistance: 0,
    visitPayment: "0",
    userId: "sales",
  },
  {
    customerNo: "MB00005",
    customerName: "Toko Cat & Bangunan Atas",
    customerPhone: "08206991260",
    badanUsaha: "Kuliner",
    alamat: "Jl. Contoh Alamat No. 5, Jakarta Selatan",
    balance: 2882361,
    balanceCredit: 906162,
    status: "MACET",
    visitStatus: "TODO",
    lat: -6.3692025,
    lng: 106.7407597,
    lastUpdated: "2025-01-25T11:00:01",
    visitDate: "2025-01-25",
    visitTime: "10:34",
    visitAddress:
      "Jl. Contoh Alamat No. 5, Jakarta Selatan (lokasi kunjungan)",
    visitNote: "Konsumen tidak di tempat",
    visitLat: -6.261895,
    visitLng: 106.821267,
    visitLastUpdated: "2025-01-20T09:06:00",
    visitDistance: 0,
    visitPayment: "0",
    userId: "sales",
  },
  {
    customerNo: "MB00006",
    customerName: "Toko Material Bang Adi",
    customerPhone: "08123456789",
    badanUsaha: "Retail",
    alamat: "Jl. Melati No. 6, Jakarta Selatan",
    balance: 7320000,
    balanceCredit: 520000,
    status: "MACET",
    visitStatus: "TODO",
    lat: -6.265821,
    lng: 106.812219,
    lastUpdated: "2025-01-26T13:00:01",
    visitDate: "2025-01-26",
    visitTime: "13:45",
    visitAddress:
      "Jl. Melati No. 6, Jakarta Selatan (lokasi kunjungan)",
    visitNote: "Belum ada pembayaran",
    visitLat: -6.263111,
    visitLng: 106.819001,
    visitLastUpdated: "2025-01-20T09:10:00",
    visitDistance: 0,
    visitPayment: "0",
    userId: "collector",
  },
  {
    customerNo: "MB00007",
    customerName: "Toko Bangunan Pak Andre",
    customerPhone: "08234567890",
    badanUsaha: "Kuliner",
    alamat: "Jl. Kenanga No. 7, Jakarta Selatan",
    balance: 8500000,
    balanceCredit: 300000,
    status: "LANCAR",
    visitStatus: "TODO",
    lat: -6.268401,
    lng: 106.808721,
    lastUpdated: "2025-01-25T14:00:01",
    visitDate: "2025-01-25T10:00:00",
    visitTime: "10:00",
    visitAddress:
      "Jl. Kenanga No. 7, Jakarta Selatan (lokasi kunjungan)",
    visitNote: "",
    visitLat: -6.270012,
    visitLng: 106.814455,
    visitLastUpdated: "2025-01-20T10:15:00",
    visitCheckIn: "2025-01-25T10:00:00",
    visitDistance: 0,
    visitPayment: "50000",
    userId: "collector",
  },
  {
    customerNo: "MB00008",
    customerName: "Toko Besi & Material Yuli",
    customerPhone: "08765432100",
    badanUsaha: "Retail",
    alamat: "Jl. Cempaka No. 8, Jakarta Selatan",
    balance: 10250000,
    balanceCredit: 650000,
    status: "MACET",
    visitStatus: "TODO",
    lat: -6.271512,
    lng: 106.807456,
    lastUpdated: "2025-01-24T15:00:01",
    visitDate: "2025-01-24",
    visitTime: "11:30",
    visitAddress:
      "Jl. Cempaka No. 8, Jakarta Selatan (lokasi kunjungan)",
    visitNote: "Konsumen janji bayar minggu depan",
    visitLat: -6.5896448,
    visitLng: 106.790912,
    visitLastUpdated: "2025-01-20T11:00:00",
    visitDistance: 0,
    visitPayment: "0",
    userId: "collector",
  },
  {
    customerNo: "MB00009",
    customerName: "Toko Bangunan Kito Galo",
    customerPhone: "08127894563",
    badanUsaha: "Kuliner",
    alamat: "Jl. Dahlia No. 9, Jakarta Selatan",
    balance: 6250000,
    balanceCredit: 412000,
    status: "LANCAR",
    visitStatus: "TODO",
    lat: -6.276012,
    lng: 106.81111,
    lastUpdated: "2025-01-23T12:00:01",
    visitDate: "2025-01-23",
    visitTime: "09:45",
    visitAddress:
      "Jl. Dahlia No. 9, Jakarta Selatan (lokasi kunjungan)",
    visitNote: "Konsumen sudah membayar sebagian",
    visitLat: -6.275112,
    visitLng: 106.814213,
    visitLastUpdated: "2025-01-20T08:55:00",
    visitDistance: 0,
    visitPayment: "100000",
    userId: "collector",
  },
  {
    customerNo: "MB00010",
    customerName: "Toko Material Anggrek Jaya",
    customerPhone: "08569012345",
    badanUsaha: "Retail",
    alamat: "Jl. Anggrek No. 10, Jakarta Selatan",
    balance: 9740000,
    balanceCredit: 489000,
    status: "MACET",
    visitStatus: "TODO",
    lat: -6.278901,
    lng: 106.813812,
    lastUpdated: "2025-01-22T09:00:01",
    visitDate: "2025-01-22",
    visitTime: "16:00",
    visitAddress:
      "Jl. Anggrek No. 10, Jakarta Selatan (lokasi kunjungan)",
    visitNote: "Konsumen tidak merespon",
    visitLat: -6.279501,
    visitLng: 106.816345,
    visitLastUpdated: "2025-01-20T10:20:00",
    visitDistance: 0,
    visitPayment: "0",
    userId: "collector",
  },
];

export const sampleStatisticStore: StatisticStore[] = [
  {
    customerId: 'MB00003',
    totalItems: 2,
    totalSales: 89380
  }
]

export type ReimbursementStatus = 'WAITING' | 'APPROVED' | 'REJECTED'
export type ReimbursementCategory = 'TRANSPORT' | 'MEAL' | 'PARKING' | 'OTHER'
export type ReimbursementType = 'GENERAL' | 'STORE'

export interface Reimbursement {
  user_id: string
  date: string
  category: ReimbursementCategory
  amount: number
  note?: string
  status: ReimbursementStatus
}

export interface ReimbursementStore {
  user_id: string
  date: string
  category: ReimbursementCategory
  amount: number
  note?: string
  status: ReimbursementStatus
  customer_no: string
}

export interface VReimbursementSummary {
  user_id: string
  date: string
  total_amount: number
}

export interface VisitImage {
  id: string
  visit_id: string
  category: string
  url: string
}