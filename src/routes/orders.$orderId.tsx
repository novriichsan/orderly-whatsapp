import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { useAppStore } from "@/store/app-store";
import { TopBar } from "@/components/top-bar";
import { Page, StatusPill, EmptyState } from "@/components/page";
import { EstimationCard } from "@/components/estimation-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculatePrice } from "@/lib/pricing";
import { Trash2, Save, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import type { OrderStatus } from "@/lib/types";

export const Route = createFileRoute("/orders/$orderId")({ component: OrderDetail });

function OrderDetail() {
  const { orderId } = useParams({ from: "/orders/$orderId" });
  const navigate = useNavigate();
  const order = useAppStore((s) => s.orders.find((o) => o.id === orderId));
  const products = useAppStore((s) => s.products);
  const updateOrder = useAppStore((s) => s.updateOrder);
  const deleteOrder = useAppStore((s) => s.deleteOrder);

  const [draft, setDraft] = useState(order);

  useEffect(() => { setDraft(order); }, [order]);

  if (!order || !draft) {
    return (
      <>
        <TopBar title="Order tidak ditemukan" back />
        <Page>
          <EmptyState title="Order tidak ditemukan" description="Mungkin sudah dihapus." action={
            <Link to="/orders" className="text-sm text-primary">Ke daftar</Link>
          } />
        </Page>
      </>
    );
  }

  const product = useMemo(() => products.find((p) => p.id === draft.productId)!, [products, draft.productId]);
  const category = useMemo(() => product.categories.find((c) => c.id === draft.categoryId) ?? product.categories[0], [product, draft.categoryId]);
  const sub = useMemo(() => category.subcategories.find((s) => s.id === draft.subcategoryId) ?? category.subcategories[0], [category, draft.subcategoryId]);
  const price = useMemo(() => calculatePrice(product, sub, draft.area), [product, sub, draft.area]);

  const update = <K extends keyof typeof draft>(key: K, value: typeof draft[K]) => {
    setDraft({ ...draft, [key]: value });
  };

  const handleProductChange = (id: string) => {
    const p = products.find((pp) => pp.id === id)!;
    const c = p.categories[0];
    const s = c.subcategories[0];
    setDraft({
      ...draft,
      productId: p.id, productName: p.name,
      categoryId: c.id, categoryName: c.name,
      subcategoryId: s.id, subcategoryName: s.name,
      area: p.requiresArea ? (draft.area ?? 1) : undefined,
    });
  };

  const handleCategoryChange = (id: string) => {
    const c = product.categories.find((c) => c.id === id)!;
    const s = c.subcategories[0];
    setDraft({ ...draft, categoryId: c.id, categoryName: c.name, subcategoryId: s.id, subcategoryName: s.name });
  };

  const handleSubChange = (id: string) => {
    const s = category.subcategories.find((s) => s.id === id)!;
    setDraft({ ...draft, subcategoryId: s.id, subcategoryName: s.name });
  };

  const save = () => {
    updateOrder(order.id, { ...draft, price });
    toast.success("Order tersimpan", { description: order.id });
  };

  const setStatus = (status: OrderStatus) => {
    updateOrder(order.id, { status });
    setDraft({ ...draft, status });
    toast.success(`Status: ${status}`);
  };

  const remove = () => {
    deleteOrder(order.id);
    toast.success("Order dihapus");
    navigate({ to: "/orders" });
  };

  return (
    <>
      <TopBar
        title={order.id}
        subtitle={order.source === "whatsapp" ? "Diimpor dari WhatsApp" : "Order manual"}
        back
        right={<StatusPill status={draft.status} />}
      />
      <Page>
        <div className="space-y-3">
          <Section title="Customer">
            <Field label="Nama">
              <Input value={draft.customerName} onChange={(e) => update("customerName", e.target.value)} />
            </Field>
            <Field label="Alamat">
              <Textarea rows={2} value={draft.address} onChange={(e) => update("address", e.target.value)} />
            </Field>
          </Section>

          <Section title="Layanan">
            <Field label="Produk">
              <Select value={draft.productId} onValueChange={handleProductChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.icon} {p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Kategori">
              <Select value={draft.categoryId} onValueChange={handleCategoryChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {product.categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Sub-Kategori">
              <Select value={draft.subcategoryId} onValueChange={handleSubChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {category.subcategories.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {product.requiresArea && (
              <Field label="Luas Bangunan (m²)">
                <Input
                  type="number" min={1} step="any"
                  value={draft.area ?? ""}
                  onChange={(e) => update("area", e.target.value === "" ? undefined : Number(e.target.value))}
                  required
                />
              </Field>
            )}
          </Section>

          <Section title="Jadwal">
            <div className="grid grid-cols-2 gap-2">
              <Field label="Tanggal">
                <Input
                  type="date"
                  value={draft.date.slice(0, 10)}
                  onChange={(e) => update("date", new Date(e.target.value).toISOString())}
                />
              </Field>
              <Field label="Waktu">
                <Input type="time" value={draft.time} onChange={(e) => update("time", e.target.value)} />
              </Field>
            </div>
          </Section>

          <Section title="Catatan">
            <Textarea rows={3} value={draft.notes ?? ""} onChange={(e) => update("notes", e.target.value)} placeholder="Catatan internal..." />
          </Section>

          <EstimationCard
            price={price}
            subcategoryName={sub.name}
            area={product.requiresArea ? draft.area : undefined}
            perAreaRate={product.requiresArea ? sub.monthlyFee : undefined}
            oneTimeLineLabel={`Biaya ${sub.name}`}
          />

          <Section title="Status">
            <div className="flex flex-wrap gap-1.5">
              {(["draft","pending","confirmed","scheduled","completed","cancelled"] as OrderStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`rounded-full px-3 py-1.5 text-[11px] font-medium capitalize transition ${
                    draft.status === s ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </Section>

          <Button variant="outline" className="w-full text-destructive" onClick={remove}>
            <Trash2 className="mr-2 h-4 w-4" /> Hapus Order
          </Button>
        </div>
      </Page>

      <div className="glass sticky bottom-[57px] z-20 -mt-px border-t border-border px-3 py-2">
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setStatus("confirmed")}>
            <CheckCircle2 className="mr-2 h-4 w-4" /> Confirm
          </Button>
          <Button className="flex-1 rounded-xl grad-primary text-primary-foreground" onClick={save}>
            <Save className="mr-2 h-4 w-4" /> Simpan
          </Button>
        </div>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-soft)]">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1 block text-[11px] font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
