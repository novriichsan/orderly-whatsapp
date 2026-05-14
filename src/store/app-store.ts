import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order, Customer, QuickReply, Product, OrderStatus } from "@/lib/types";
import { ORDERS, CUSTOMERS, QUICK_REPLIES, PRODUCTS } from "@/lib/mock-data";
import { calculatePrice } from "@/lib/pricing";
import { parseWhatsAppMessage } from "@/lib/parser";

interface AppState {
  theme: "light" | "dark";
  toggleTheme: () => void;

  products: Product[];
  orders: Order[];
  customers: Customer[];
  quickReplies: QuickReply[];

  // Orders
  addOrder: (o: Order) => void;
  updateOrder: (id: string, patch: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  setOrderStatus: (id: string, status: OrderStatus) => void;

  // Customers
  addCustomer: (c: Customer) => void;
  updateCustomer: (id: string, patch: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  // Quick replies
  addQuickReply: (q: QuickReply) => void;
  updateQuickReply: (id: string, patch: Partial<QuickReply>) => void;
  deleteQuickReply: (id: string) => void;

  // Import flow
  pendingImport: string | null;
  setPendingImport: (msg: string | null) => void;
  importFromMessage: (msg: string) => string; // returns new order id
}

const newId = (prefix: string) =>
  `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: "light",
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),

      products: PRODUCTS,
      orders: ORDERS,
      customers: CUSTOMERS,
      quickReplies: QUICK_REPLIES,

      addOrder: (o) => set((s) => ({ orders: [o, ...s.orders] })),
      updateOrder: (id, patch) =>
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === id
              ? { ...o, ...patch, updatedAt: new Date().toISOString() }
              : o,
          ),
        })),
      deleteOrder: (id) =>
        set((s) => ({ orders: s.orders.filter((o) => o.id !== id) })),
      setOrderStatus: (id, status) =>
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === id
              ? { ...o, status, updatedAt: new Date().toISOString() }
              : o,
          ),
        })),

      addCustomer: (c) => set((s) => ({ customers: [c, ...s.customers] })),
      updateCustomer: (id, patch) =>
        set((s) => ({
          customers: s.customers.map((c) =>
            c.id === id ? { ...c, ...patch } : c,
          ),
        })),
      deleteCustomer: (id) =>
        set((s) => ({ customers: s.customers.filter((c) => c.id !== id) })),

      addQuickReply: (q) =>
        set((s) => ({ quickReplies: [q, ...s.quickReplies] })),
      updateQuickReply: (id, patch) =>
        set((s) => ({
          quickReplies: s.quickReplies.map((q) =>
            q.id === id ? { ...q, ...patch } : q,
          ),
        })),
      deleteQuickReply: (id) =>
        set((s) => ({
          quickReplies: s.quickReplies.filter((q) => q.id !== id),
        })),

      pendingImport: null,
      setPendingImport: (msg) => set({ pendingImport: msg }),
      importFromMessage: (msg) => {
        const parsed = parseWhatsAppMessage(msg);
        const product =
          get().products.find((p) => p.id === parsed.productId) ||
          get().products[0];
        const category =
          product.categories.find((c) => c.id === parsed.categoryId) ||
          product.categories[0];
        const sub =
          category.subcategories.find((s) => s.id === parsed.subcategoryId) ||
          category.subcategories[0];

        const id = newId("ORD");
        const order: Order = {
          id,
          customerName: parsed.customerName || "Customer Baru",
          address: parsed.address || "",
          productId: product.id,
          productName: product.name,
          categoryId: category.id,
          categoryName: category.name,
          subcategoryId: sub.id,
          subcategoryName: sub.name,
          area: parsed.area,
          date: parsed.date || new Date().toISOString(),
          time: parsed.time || "10:00",
          notes: "Imported from WhatsApp",
          status: "draft",
          price: calculatePrice(product, sub, parsed.area),
          source: "whatsapp",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((s) => ({ orders: [order, ...s.orders], pendingImport: null }));
        return id;
      },
    }),
    {
      name: "wa-admin-store",
      partialize: (s) => ({
        theme: s.theme,
        orders: s.orders,
        customers: s.customers,
        quickReplies: s.quickReplies,
      }),
    },
  ),
);
