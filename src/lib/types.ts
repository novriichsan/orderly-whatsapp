export type OrderStatus =
  | "draft"
  | "pending"
  | "confirmed"
  | "scheduled"
  | "completed"
  | "cancelled";

export interface Subcategory {
  id: string;
  name: string;
  oneTimeFee: number;
  monthlyFee: number; // tariff per m² for Perpipaan, otherwise flat monthly
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiresArea: boolean;
  categories: Category[];
}

export interface PriceBreakdown {
  oneTimeSubtotal: number;
  oneTimePpn: number;
  oneTimeTotal: number;
  monthlySubtotal: number;
  monthlyPpn: number;
  monthlyTotal: number;
  hasPipingNote: boolean;
}

export interface Order {
  id: string;
  customerId?: string;
  customerName: string;
  phone?: string;
  address: string;
  productId: string;
  productName: string;
  categoryId: string;
  categoryName: string;
  subcategoryId: string;
  subcategoryName: string;
  area?: number;
  date: string; // ISO
  time: string; // HH:mm
  notes?: string;
  status: OrderStatus;
  price: PriceBreakdown;
  source: "manual" | "whatsapp";
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  notes?: string;
  tags: string[];
  status: "active" | "lead" | "inactive";
  lastInteraction: string;
  createdAt: string;
}

export interface QuickReply {
  id: string;
  title: string;
  body: string;
  category: string;
  favorite: boolean;
  type: "text" | "image";
  imageUrl?: string;
}
