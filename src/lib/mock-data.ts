import type { Product, Customer, QuickReply, Order } from "./types";
import { calculatePrice } from "./pricing";

const cat = (
  id: string,
  name: string,
  subs: Array<{ id: string; name: string; one: number; monthly: number; notes?: string }>,
) => ({
  id,
  name,
  subcategories: subs.map((s) => ({
    id: s.id,
    name: s.name,
    oneTimeFee: s.one,
    monthlyFee: s.monthly,
    notes: s.notes,
  })),
});

export const PRODUCTS: Product[] = [
  {
    id: "perpipaan",
    name: "Perpipaan",
    description: "Sambungan air bersih dan limbah",
    icon: "🚰",
    requiresArea: true,
    categories: [
      cat("rt", "Rumah Tangga", [
        { id: "p1300", name: "Daya Listrik 1.300 Watt", one: 10000, monthly: 236 },
        { id: "p2200", name: "Daya Listrik 2.200 Watt", one: 15000, monthly: 320 },
        { id: "p3500", name: "Daya Listrik 3.500 Watt", one: 22000, monthly: 410 },
      ]),
      cat("biz", "Bisnis", [
        { id: "b-small", name: "Bisnis Kecil", one: 35000, monthly: 520 },
        { id: "b-large", name: "Bisnis Besar", one: 80000, monthly: 1200 },
      ]),
    ],
  },
  {
    id: "spaldt",
    name: "SPALD-T",
    description: "Sistem pengelolaan air limbah terpusat",
    icon: "🏭",
    requiresArea: false,
    categories: [
      cat("rt", "Rumah Tangga", [
        { id: "s1300", name: "Daya Listrik 1.300 Watt", one: 10000, monthly: 236 },
        { id: "s2200", name: "Daya Listrik 2.200 Watt", one: 14000, monthly: 310 },
      ]),
    ],
  },
  {
    id: "tangki",
    name: "Tangki Septik",
    description: "Pemasangan dan pengurasan tangki septik",
    icon: "🛢️",
    requiresArea: false,
    categories: [
      cat("std", "Standar", [
        { id: "t-1m3", name: "Kapasitas 1 m³", one: 350000, monthly: 0 },
        { id: "t-2m3", name: "Kapasitas 2 m³", one: 600000, monthly: 0 },
      ]),
    ],
  },
  {
    id: "sedot",
    name: "Sedot WC",
    description: "Layanan sedot WC profesional",
    icon: "🚽",
    requiresArea: false,
    categories: [
      cat("std", "Reguler", [
        { id: "sw-2k", name: "Tangki 2.000L", one: 250000, monthly: 0 },
        { id: "sw-4k", name: "Tangki 4.000L", one: 450000, monthly: 0 },
      ]),
    ],
  },
  {
    id: "lab",
    name: "Laboratorium",
    description: "Uji kualitas air dan limbah",
    icon: "🧪",
    requiresArea: false,
    categories: [
      cat("uji", "Uji Standar", [
        { id: "lab-air", name: "Uji Air Bersih", one: 500000, monthly: 0 },
        { id: "lab-limbah", name: "Uji Air Limbah", one: 850000, monthly: 0 },
      ]),
    ],
  },
  {
    id: "b3",
    name: "Limbah B3",
    description: "Pengelolaan limbah berbahaya",
    icon: "☣️",
    requiresArea: false,
    categories: [
      cat("std", "Standar", [
        { id: "b3-1", name: "Per Drum 200L", one: 1200000, monthly: 0 },
      ]),
    ],
  },
  {
    id: "ipal",
    name: "OM IPAL",
    description: "Operasional & maintenance IPAL",
    icon: "⚙️",
    requiresArea: false,
    categories: [
      cat("std", "Bulanan", [
        { id: "ipal-s", name: "IPAL Skala Kecil", one: 0, monthly: 2500000 },
        { id: "ipal-m", name: "IPAL Skala Menengah", one: 0, monthly: 5500000 },
      ]),
    ],
  },
  {
    id: "sumbatan",
    name: "Sumbatan Pipa",
    description: "Penanganan pipa tersumbat",
    icon: "🔧",
    requiresArea: false,
    categories: [
      cat("std", "Standar", [
        { id: "sp-r", name: "Ringan", one: 200000, monthly: 0 },
        { id: "sp-b", name: "Berat", one: 500000, monthly: 0 },
      ]),
    ],
  },
  {
    id: "daur",
    name: "Air Daur Ulang",
    description: "Suplai air daur ulang",
    icon: "♻️",
    requiresArea: false,
    categories: [
      cat("std", "Standar", [
        { id: "ad-m3", name: "Per m³", one: 0, monthly: 8500 },
      ]),
    ],
  },
];

export const CUSTOMERS: Customer[] = [
  {
    id: "c1",
    name: "Ligar Aji Pandika",
    phone: "+62 812-3456-7890",
    address: "Sequis Center, SCBD, Jakarta Selatan",
    notes: "Customer prioritas, prefers WA",
    tags: ["VIP", "Korporat"],
    status: "active",
    lastInteraction: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
  {
    id: "c2",
    name: "Sari Wulandari",
    phone: "+62 821-9988-7766",
    address: "Jl. Mawar No. 12, Bandung",
    tags: ["Rumah Tangga"],
    status: "lead",
    lastInteraction: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: "c3",
    name: "PT Mitra Sejahtera",
    phone: "+62 811-2233-4455",
    address: "Kawasan Industri Pulogadung, Jakarta Timur",
    tags: ["Korporat", "Berulang"],
    status: "active",
    lastInteraction: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
  },
  {
    id: "c4",
    name: "Dewi Anggraini",
    phone: "+62 813-7777-2222",
    address: "Jl. Kenanga No. 8, Surabaya",
    tags: ["Baru"],
    status: "lead",
    lastInteraction: new Date(Date.now() - 1000 * 60 * 60 * 80).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
];

const mkOrder = (
  id: string,
  customerName: string,
  productId: string,
  catId: string,
  subId: string,
  status: Order["status"],
  daysAgo: number,
  area?: number,
): Order => {
  const product = PRODUCTS.find((p) => p.id === productId)!;
  const category = product.categories.find((c) => c.id === catId)!;
  const sub = category.subcategories.find((s) => s.id === subId)!;
  const date = new Date(Date.now() - 1000 * 60 * 60 * 24 * daysAgo);
  return {
    id,
    customerName,
    address: "Jakarta",
    productId,
    productName: product.name,
    categoryId: catId,
    categoryName: category.name,
    subcategoryId: subId,
    subcategoryName: sub.name,
    area,
    date: date.toISOString(),
    time: "10:00",
    status,
    price: calculatePrice(product, sub, area),
    source: "manual",
    createdAt: date.toISOString(),
    updatedAt: date.toISOString(),
  };
};

export const ORDERS: Order[] = [
  mkOrder("ORD-1042", "Ligar Aji Pandika", "perpipaan", "rt", "p1300", "confirmed", 1, 1),
  mkOrder("ORD-1041", "Sari Wulandari", "sedot", "std", "sw-2k", "scheduled", 2),
  mkOrder("ORD-1040", "PT Mitra Sejahtera", "ipal", "std", "ipal-m", "completed", 5),
  mkOrder("ORD-1039", "Dewi Anggraini", "tangki", "std", "t-1m3", "pending", 0),
  mkOrder("ORD-1038", "Budi Santoso", "lab", "uji", "lab-air", "draft", 0),
  mkOrder("ORD-1037", "CV Karya", "perpipaan", "biz", "b-small", "completed", 12, 24),
  mkOrder("ORD-1036", "Hendra W.", "sumbatan", "std", "sp-r", "cancelled", 8),
];

export const QUICK_REPLIES: QuickReply[] = [
  {
    id: "q1",
    title: "Salam Pembuka",
    body: "Halo! Terima kasih telah menghubungi layanan kami. Ada yang bisa kami bantu hari ini?",
    category: "Greeting",
    favorite: true,
    type: "text",
  },
  {
    id: "q2",
    title: "Konfirmasi Order",
    body: "Order Anda telah kami konfirmasi. Tim kami akan segera menghubungi untuk penjadwalan. Terima kasih 🙏",
    category: "Order",
    favorite: true,
    type: "text",
  },
  {
    id: "q3",
    title: "Estimasi Harga",
    body: "Berikut estimasi harga untuk layanan Anda. Mohon dicek dan beri tahu kami jika ada pertanyaan.",
    category: "Pricing",
    favorite: false,
    type: "text",
  },
  {
    id: "q4",
    title: "Penutup",
    body: "Terima kasih atas kepercayaan Anda. Semoga harimu menyenangkan! ✨",
    category: "Closing",
    favorite: false,
    type: "text",
  },
];
