import { createFileRoute } from "@tanstack/react-router";
import { useAppStore } from "@/store/app-store";
import { TopBar } from "@/components/top-bar";
import { Page } from "@/components/page";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Download, Moon, Sun, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({ component: Settings });

function Settings() {
  const theme = useAppStore((s) => s.theme);
  const toggle = useAppStore((s) => s.toggleTheme);
  const orders = useAppStore((s) => s.orders);
  const customers = useAppStore((s) => s.customers);

  const exportCSV = (rows: any[], name: string) => {
    if (rows.length === 0) { toast.error("Tidak ada data"); return; }
    const keys = Object.keys(rows[0]).filter((k) => typeof rows[0][k] !== "object");
    const csv = [
      keys.join(","),
      ...rows.map((r) => keys.map((k) => JSON.stringify(r[k] ?? "")).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${name}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success(`Export ${name}.csv`);
  };

  const reset = () => {
    if (confirm("Reset semua data lokal?")) {
      localStorage.removeItem("wa-admin-store");
      location.reload();
    }
  };

  return (
    <>
      <TopBar title="Settings" />
      <Page>
        <div className="space-y-3">
          <Section title="Tampilan">
            <Row
              icon={theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              label="Dark Mode"
              right={<Switch checked={theme === "dark"} onCheckedChange={toggle} />}
            />
          </Section>

          <Section title="Export Data">
            <Row icon={<Download className="h-4 w-4" />} label="Export Orders (CSV)"
              right={<Button size="sm" variant="outline" className="h-8 rounded-lg" onClick={() => exportCSV(orders.map((o) => ({
                id: o.id, customer: o.customerName, product: o.productName, sub: o.subcategoryName,
                date: o.date, status: o.status, total: o.price.oneTimeTotal + o.price.monthlyTotal,
              })), "orders")}>CSV</Button>}
            />
            <Row icon={<Download className="h-4 w-4" />} label="Export Customers (CSV)"
              right={<Button size="sm" variant="outline" className="h-8 rounded-lg" onClick={() => exportCSV(customers.map((c) => ({
                id: c.id, name: c.name, phone: c.phone, address: c.address, status: c.status,
              })), "customers")}>CSV</Button>}
            />
          </Section>

          <Section title="Tentang">
            <Row icon={<FileText className="h-4 w-4" />} label="Versi" right={<span className="text-[11px] text-muted-foreground">1.0.0 dummy</span>} />
            <Row icon={<Trash2 className="h-4 w-4 text-destructive" />} label="Reset semua data"
              right={<Button size="sm" variant="outline" className="h-8 rounded-lg text-destructive" onClick={reset}>Reset</Button>}
            />
          </Section>

          <p className="px-2 text-center text-[10px] text-muted-foreground">
            Data tersimpan lokal di browser. Belum terhubung ke backend.
          </p>
        </div>
      </Page>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
      <p className="border-b border-border bg-muted/30 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
      <div className="divide-y divide-border">{children}</div>
    </div>
  );
}

function Row({ icon, label, right }: { icon: React.ReactNode; label: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 px-3 py-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-accent-foreground">{icon}</span>
      <span className="flex-1 text-sm font-medium">{label}</span>
      {right}
    </div>
  );
}
