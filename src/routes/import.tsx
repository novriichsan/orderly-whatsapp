import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAppStore } from "@/store/app-store";
import { TopBar } from "@/components/top-bar";
import { Page } from "@/components/page";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SAMPLE_MESSAGE, parseWhatsAppMessage } from "@/lib/parser";
import { Sparkles, MessageSquareText, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/import")({ component: ImportPage });

function ImportPage() {
  const pending = useAppStore((s) => s.pendingImport);
  const setPending = useAppStore((s) => s.setPendingImport);
  const importFromMessage = useAppStore((s) => s.importFromMessage);
  const navigate = useNavigate();

  const [text, setText] = useState(pending ?? "");
  const [loading, setLoading] = useState(false);
  const parsed = text ? parseWhatsAppMessage(text) : null;

  useEffect(() => {
    if (pending) { setText(pending); setPending(null); }
  }, [pending, setPending]);

  const doImport = () => {
    if (!text.trim()) { toast.error("Pesan kosong"); return; }
    setLoading(true);
    setTimeout(() => {
      const id = importFromMessage(text);
      toast.success("Order draft dibuat", { description: id });
      navigate({ to: "/orders/$orderId", params: { orderId: id } });
    }, 600);
  };

  return (
    <>
      <TopBar title="Import dari WhatsApp" subtitle="Tempel pesan customer" back />
      <Page>
        <div className="mb-3 flex items-start gap-2 rounded-2xl border border-primary/30 bg-primary/5 p-3 text-[11px]">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
          <p>Tempel pesan WhatsApp di bawah. Parser akan otomatis mendeteksi produk, jadwal, dan customer.</p>
        </div>

        <Textarea
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tempel pesan di sini..."
          className="rounded-2xl bg-card text-sm"
        />

        <div className="mt-2 flex gap-2">
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => setText(SAMPLE_MESSAGE)}>
            <MessageSquareText className="mr-1.5 h-3.5 w-3.5" /> Pesan contoh
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full" onClick={() => setText("")}>Bersihkan</Button>
        </div>

        {parsed && (
          <div className="mt-4 rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-soft)]">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Hasil parser</p>
            <dl className="grid grid-cols-3 gap-y-1.5 text-[11px]">
              <Row k="Produk" v={parsed.productName} />
              <Row k="Kategori" v={parsed.categoryName} />
              <Row k="Sub-Kategori" v={parsed.subcategoryName} />
              <Row k="Luas" v={parsed.area ? `${parsed.area} m²` : undefined} />
              <Row k="Tanggal" v={parsed.date ? new Date(parsed.date).toLocaleDateString("id-ID") : undefined} />
              <Row k="Waktu" v={parsed.time} />
              <Row k="Nama" v={parsed.customerName} />
              <Row k="Alamat" v={parsed.address} />
            </dl>
          </div>
        )}
      </Page>
      <div className="glass sticky bottom-[57px] z-20 border-t border-border px-3 py-2">
        <Button
          className="w-full rounded-xl grad-primary text-primary-foreground"
          onClick={doImport}
          disabled={loading || !text.trim()}
        >
          {loading ? "Memproses..." : (<>Buat Draft Order <ArrowRight className="ml-1.5 h-4 w-4" /></>)}
        </Button>
      </div>
    </>
  );
}

function Row({ k, v }: { k: string; v?: string }) {
  return (
    <>
      <dt className="col-span-1 text-muted-foreground">{k}</dt>
      <dd className="col-span-2 truncate font-medium">{v ?? <span className="text-muted-foreground">—</span>}</dd>
    </>
  );
}
