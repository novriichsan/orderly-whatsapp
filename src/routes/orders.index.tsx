import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Plus, Filter as FilterIcon } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { TopBar } from "@/components/top-bar";
import { Page, StatusPill, EmptyState } from "@/components/page";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatIDR } from "@/lib/pricing";
import type { OrderStatus } from "@/lib/types";
import { motion } from "framer-motion";

export const Route = createFileRoute("/orders/")({ component: OrdersList });

const STATUSES: (OrderStatus | "all")[] = ["all", "draft", "pending", "confirmed", "scheduled", "completed", "cancelled"];

function OrdersList() {
  const orders = useAppStore((s) => s.orders);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<OrderStatus | "all">("all");

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchQ = q
        ? (o.customerName + o.productName + o.id).toLowerCase().includes(q.toLowerCase())
        : true;
      const matchS = status === "all" ? true : o.status === status;
      return matchQ && matchS;
    });
  }, [orders, q, status]);

  return (
    <>
      <TopBar title="Orders" subtitle={`${filtered.length} hasil`} />
      <Page>
        <div className="mb-3 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari customer, produk, ID..."
              className="h-10 rounded-xl border-border bg-card pl-9 text-sm"
            />
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl">
            <FilterIcon className="h-4 w-4" />
          </Button>
        </div>

        <div className="-mx-3 mb-3 overflow-x-auto px-3 scrollbar-hide">
          <div className="flex gap-1.5">
            {STATUSES.map((s) => {
              const active = status === s;
              return (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-medium capitalize transition ${
                    active
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon="🧾"
            title="Belum ada order"
            description="Buat order baru atau impor dari WhatsApp."
            action={
              <Link to="/orders/new" className="inline-flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
                <Plus className="h-3.5 w-3.5" /> Buat Order
              </Link>
            }
          />
        ) : (
          <ul className="space-y-2">
            {filtered.map((o, i) => (
              <motion.li
                key={o.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
              >
                <Link
                  to="/orders/$orderId"
                  params={{ orderId: o.id }}
                  className="block rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-soft)] transition hover:border-primary/40"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[10px] font-mono text-muted-foreground">{o.id}</p>
                      <p className="truncate text-sm font-semibold">{o.customerName}</p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {o.productName} · {o.subcategoryName}
                      </p>
                    </div>
                    <StatusPill status={o.status} />
                  </div>
                  <div className="mt-2 flex items-center justify-between border-t border-dashed border-border pt-2 text-[11px]">
                    <span className="text-muted-foreground">
                      {new Date(o.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                    </span>
                    <span className="font-semibold text-primary">
                      {formatIDR(o.price.oneTimeTotal + o.price.monthlyTotal)}
                    </span>
                  </div>
                </Link>
              </motion.li>
            ))}
          </ul>
        )}

        <Link
          to="/orders/new"
          className="fixed bottom-20 left-1/2 z-30 flex h-12 -translate-x-1/2 items-center gap-2 rounded-full grad-primary px-5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elevated)] transition hover:scale-105"
          style={{ left: "min(50%, calc(100vw - 4rem))" }}
        >
          <Plus className="h-4 w-4" /> New Order
        </Link>
      </Page>
    </>
  );
}
