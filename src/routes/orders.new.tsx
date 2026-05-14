import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAppStore } from "@/store/app-store";
import { TopBar } from "@/components/top-bar";
import { Page } from "@/components/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EstimationCard } from "@/components/estimation-card";
import { calculatePrice } from "@/lib/pricing";
import { toast } from "sonner";
import type { Order } from "@/lib/types";
import { Save } from "lucide-react";

export const Route = createFileRoute("/orders/new")({ component: NewOrder });

function NewOrder() {
  const products = useAppStore((s) => s.products);
  const addOrder = useAppStore((s) => s.addOrder);
  const navigate = useNavigate();

  const [productId, setProductId] = useState(products[0].id);
  const product = products.find((p) => p.id === productId)!;
  const [categoryId, setCategoryId] = useState(product.categories[0].id);
  const category = product.categories.find((c) => c.id === categoryId) ?? product.categories[0];
  const [subId, setSubId] = useState(category.subcategories[0].id);
  const sub = category.subcategories.find((s) => s.id === subId) ?? category.subcategories[0];
  const [area, setArea] = useState<number | undefined>(product.requiresArea ? 1 : undefined);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState("10:00");
  const [notes, setNotes] = useState("");

  const price = calculatePrice(product, sub, area);

  const save = () => {
    if (!name.trim()) { toast.error("Nama customer wajib"); return; }
    if (product.requiresArea && (!area || area <= 0)) { toast.error("Luas wajib diisi"); return; }
    const id = "ORD-" + Math.floor(1000 + Math.random() * 9000);
    const o: Order = {
      id,
      customerName: name,
      address,
      productId: product.id, productName: product.name,
      categoryId: category.id, categoryName: category.name,
      subcategoryId: sub.id, subcategoryName: sub.name,
      area, date: new Date(date).toISOString(), time, notes,
      status: "draft", price, source: "manual",
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    addOrder(o);
    toast.success("Order dibuat", { description: id });
    navigate({ to: "/orders/$orderId", params: { orderId: id } });
  };

  return (
    <>
      <TopBar title="Buat Order Baru" back />
      <Page>
        <div className="space-y-3">
          <Card title="Customer">
            <F label="Nama"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama lengkap" /></F>
            <F label="Alamat"><Textarea rows={2} value={address} onChange={(e) => setAddress(e.target.value)} /></F>
          </Card>

          <Card title="Layanan">
            <F label="Produk">
              <Select value={productId} onValueChange={(v) => {
                setProductId(v);
                const np = products.find((p) => p.id === v)!;
                setCategoryId(np.categories[0].id);
                setSubId(np.categories[0].subcategories[0].id);
                setArea(np.requiresArea ? 1 : undefined);
              }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {products.map((p) => <SelectItem key={p.id} value={p.id}>{p.icon} {p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </F>
            <F label="Kategori">
              <Select value={categoryId} onValueChange={(v) => {
                setCategoryId(v);
                const nc = product.categories.find((c) => c.id === v)!;
                setSubId(nc.subcategories[0].id);
              }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {product.categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </F>
            <F label="Sub-Kategori">
              <Select value={subId} onValueChange={setSubId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {category.subcategories.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </F>
            {product.requiresArea && (
              <F label="Luas Bangunan (m²)">
                <Input type="number" min={1} step="any" value={area ?? ""}
                  onChange={(e) => setArea(e.target.value === "" ? undefined : Number(e.target.value))} required />
              </F>
            )}
          </Card>

          <Card title="Jadwal">
            <div className="grid grid-cols-2 gap-2">
              <F label="Tanggal"><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></F>
              <F label="Waktu"><Input type="time" value={time} onChange={(e) => setTime(e.target.value)} /></F>
            </div>
          </Card>

          <Card title="Catatan">
            <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Opsional..." />
          </Card>

          <EstimationCard
            price={price}
            subcategoryName={sub.name}
            area={product.requiresArea ? area : undefined}
            perAreaRate={product.requiresArea ? sub.monthlyFee : undefined}
            oneTimeLineLabel={`Biaya ${sub.name}`}
          />
        </div>
      </Page>
      <div className="glass sticky bottom-[57px] z-20 border-t border-border px-3 py-2">
        <Button className="w-full rounded-xl grad-primary text-primary-foreground" onClick={save}>
          <Save className="mr-2 h-4 w-4" /> Simpan Order
        </Button>
      </div>
    </>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-soft)]">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1 block text-[11px] font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
