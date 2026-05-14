import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAppStore } from "@/store/app-store";
import { TopBar } from "@/components/top-bar";
import { Page, StatusPill, EmptyState } from "@/components/page";
import { Input } from "@/components/ui/input";
import { Search, Phone, MapPin } from "lucide-react";

export const Route = createFileRoute("/customers/")({ component: Customers });

function Customers() {
  const customers = useAppStore((s) => s.customers);
  const orders = useAppStore((s) => s.orders);
  const [q, setQ] = useState("");

  const filtered = customers.filter((c) =>
    (c.name + c.phone + c.address).toLowerCase().includes(q.toLowerCase())
  );

  return (
    <>
      <TopBar title="Customers" subtitle={`${customers.length} kontak`} />
      <Page>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Cari customer..."
            className="h-10 rounded-xl bg-card pl-9 text-sm"
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon="👥" title="Tidak ada customer" />
        ) : (
          <ul className="space-y-2">
            {filtered.map((c) => {
              const orderCount = orders.filter((o) => o.customerName === c.name).length;
              const initials = c.name.split(" ").map((p) => p[0]).slice(0, 2).join("");
              return (
                <li key={c.id}>
                  <Link
                    to="/customers/$customerId"
                    params={{ customerId: c.id }}
                    className="flex items-start gap-3 rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-soft)] transition hover:border-primary/40"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl grad-primary text-sm font-bold text-primary-foreground">
                      {initials.toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold">{c.name}</p>
                        <StatusPill status={c.status} />
                      </div>
                      <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-muted-foreground">
                        <Phone className="h-3 w-3" /> {c.phone}
                      </p>
                      <p className="flex items-center gap-1 truncate text-[11px] text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {c.address}
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {c.tags.map((t) => (
                          <span key={t} className="rounded-full bg-accent px-1.5 py-0.5 text-[9px] font-medium text-accent-foreground">{t}</span>
                        ))}
                        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">{orderCount} order</span>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Page>
    </>
  );
}
