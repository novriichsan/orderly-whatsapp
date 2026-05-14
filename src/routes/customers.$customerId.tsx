import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useAppStore } from "@/store/app-store";
import { TopBar } from "@/components/top-bar";
import { Page, StatusPill, EmptyState } from "@/components/page";
import { Phone, MapPin, MessageCircle, FileText } from "lucide-react";
import { formatIDR } from "@/lib/pricing";

export const Route = createFileRoute("/customers/$customerId")({ component: CustomerDetail });

function CustomerDetail() {
  const { customerId } = useParams({ from: "/customers/$customerId" });
  const customer = useAppStore((s) => s.customers.find((c) => c.id === customerId));
  const orders = useAppStore((s) => s.orders);

  if (!customer) {
    return (
      <>
        <TopBar title="Customer" back />
        <Page><EmptyState title="Tidak ditemukan" /></Page>
      </>
    );
  }

  const customerOrders = orders.filter((o) => o.customerName === customer.name);
  const initials = customer.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  return (
    <>
      <TopBar title={customer.name} back />
      <Page>
        <div className="mb-3 rounded-3xl border border-border bg-card p-4 text-center shadow-[var(--shadow-soft)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl grad-primary text-lg font-bold text-primary-foreground">
            {initials}
          </div>
          <h2 className="mt-2 text-base font-semibold">{customer.name}</h2>
          <div className="mt-1 flex justify-center"><StatusPill status={customer.status} /></div>
          <div className="mt-3 flex justify-center gap-2">
            <a href={`tel:${customer.phone}`} className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary"><Phone className="h-4 w-4" /></a>
            <a href={`https://wa.me/${customer.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/15 text-success"><MessageCircle className="h-4 w-4" /></a>
          </div>
        </div>

        <div className="mb-3 space-y-2 rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-soft)]">
          <Row icon={<Phone className="h-3.5 w-3.5" />} label="Telepon" value={customer.phone} />
          <Row icon={<MapPin className="h-3.5 w-3.5" />} label="Alamat" value={customer.address} />
          {customer.notes && <Row icon={<FileText className="h-3.5 w-3.5" />} label="Catatan" value={customer.notes} />}
        </div>

        {customer.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {customer.tags.map((t) => (
              <span key={t} className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-foreground">#{t}</span>
            ))}
          </div>
        )}

        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Riwayat Order ({customerOrders.length})</h3>
        {customerOrders.length === 0 ? (
          <EmptyState icon="🧾" title="Belum ada order" />
        ) : (
          <ul className="space-y-2">
            {customerOrders.map((o) => (
              <li key={o.id}>
                <Link
                  to="/orders/$orderId" params={{ orderId: o.id }}
                  className="block rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-soft)]"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-mono text-muted-foreground">{o.id}</p>
                    <StatusPill status={o.status} />
                  </div>
                  <p className="mt-1 text-sm font-medium">{o.productName} · {o.subcategoryName}</p>
                  <p className="mt-1 text-[11px] font-semibold text-primary">
                    {formatIDR(o.price.oneTimeTotal + o.price.monthlyTotal)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Page>
    </>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 text-[11px]">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-muted-foreground">{label}</p>
        <p className="font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
