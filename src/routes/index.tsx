import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  TrendingUp, ShoppingBag, Clock, Wallet, Plus, MessageSquareText, Sparkles,
} from "lucide-react";
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis,
} from "recharts";
import { useAppStore } from "@/store/app-store";
import { TopBar } from "@/components/top-bar";
import { Page, StatusPill } from "@/components/page";
import { formatIDR } from "@/lib/pricing";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({ component: Dashboard });

function Dashboard() {
  const orders = useAppStore((s) => s.orders);
  const customers = useAppStore((s) => s.customers);

  const totalOrders = orders.length;
  const pending = orders.filter((o) => o.status === "pending" || o.status === "draft").length;
  const revenue = orders
    .filter((o) => o.status === "completed" || o.status === "confirmed")
    .reduce((sum, o) => sum + o.price.oneTimeTotal + o.price.monthlyTotal, 0);

  const chartData = Array.from({ length: 7 }, (_, i) => ({
    d: ["Sen","Sel","Rab","Kam","Jum","Sab","Min"][i],
    v: 4 + Math.round(Math.sin(i * 1.1) * 3 + Math.random() * 4 + 6),
  }));

  const recent = orders.slice(0, 4);

  return (
    <>
      <TopBar title="Dashboard" subtitle="Halo, Admin 👋" />
      <Page>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 overflow-hidden rounded-3xl grad-primary p-4 text-primary-foreground shadow-[var(--shadow-elevated)]"
        >
          <div className="flex items-center gap-2 text-[11px] opacity-90">
            <Sparkles className="h-3.5 w-3.5" /> Estimasi Pendapatan
          </div>
          <p className="mt-1 text-2xl font-bold tracking-tight">{formatIDR(revenue)}</p>
          <p className="mt-1 text-[11px] opacity-80">{totalOrders} order total · {pending} perlu tindakan</p>

          <div className="-mx-1 mt-3 h-20">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="white" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="white" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip cursor={false} contentStyle={{ display: "none" }} />
                <XAxis dataKey="d" hide />
                <Area type="monotone" dataKey="v" stroke="white" strokeWidth={2} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <div className="mb-3 grid grid-cols-3 gap-2">
          <Stat icon={<ShoppingBag className="h-4 w-4" />} label="Orders" value={totalOrders} />
          <Stat icon={<Clock className="h-4 w-4" />} label="Pending" value={pending} accent="warning" />
          <Stat icon={<TrendingUp className="h-4 w-4" />} label="Customers" value={customers.length} accent="success" />
        </div>

        <SectionHead title="Quick Actions" />
        <div className="mb-4 grid grid-cols-2 gap-2">
          <ActionTile to="/orders/new" icon={<Plus className="h-4 w-4" />} label="New Order" />
          <ActionTile to="/import" icon={<MessageSquareText className="h-4 w-4" />} label="Import WA" />
        </div>

        <SectionHead title="Recent Orders" link="/orders" />
        <ul className="space-y-2">
          {recent.map((o) => (
            <li key={o.id}>
              <Link
                to="/orders/$orderId"
                params={{ orderId: o.id }}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-lg">
                  <Wallet className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold">{o.customerName}</p>
                    <StatusPill status={o.status} />
                  </div>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {o.productName} · {o.subcategoryName}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Page>
    </>
  );
}

function Stat({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: number; accent?: "warning" | "success" }) {
  const color = accent === "warning" ? "text-warning" : accent === "success" ? "text-success" : "text-primary";
  return (
    <div className="rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-soft)]">
      <div className={`mb-1 ${color}`}>{icon}</div>
      <p className="text-lg font-bold leading-none">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

function SectionHead({ title, link }: { title: string; link?: string }) {
  return (
    <div className="mb-2 mt-2 flex items-center justify-between">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h2>
      {link && (
        <Link to={link} className="text-[11px] font-medium text-primary">View all</Link>
      )}
    </div>
  );
}

function ActionTile({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-2 rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-soft)] transition-all hover:border-primary/40"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl grad-primary text-primary-foreground transition-transform group-hover:scale-105">
        {icon}
      </span>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}

// Suppress unused warning
void Button;
