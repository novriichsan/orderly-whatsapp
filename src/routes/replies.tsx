import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAppStore } from "@/store/app-store";
import { TopBar } from "@/components/top-bar";
import { Page, EmptyState } from "@/components/page";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Star, Copy, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/replies")({ component: Replies });

function Replies() {
  const replies = useAppStore((s) => s.quickReplies);
  const add = useAppStore((s) => s.addQuickReply);
  const update = useAppStore((s) => s.updateQuickReply);
  const remove = useAppStore((s) => s.deleteQuickReply);
  const [q, setQ] = useState("");
  const [showFavOnly, setShowFavOnly] = useState(false);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ title: "", body: "", category: "General" });

  const filtered = replies.filter((r) =>
    (showFavOnly ? r.favorite : true) &&
    (r.title + r.body + r.category).toLowerCase().includes(q.toLowerCase())
  );

  const copy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => toast.success("Disalin ke clipboard"));
  };

  const create = () => {
    if (!draft.title.trim() || !draft.body.trim()) { toast.error("Lengkapi data"); return; }
    add({
      id: "qr-" + Math.random().toString(36).slice(2, 8),
      title: draft.title, body: draft.body, category: draft.category,
      favorite: false, type: "text",
    });
    setDraft({ title: "", body: "", category: "General" });
    setOpen(false);
    toast.success("Template ditambahkan");
  };

  return (
    <>
      <TopBar title="Quick Replies" subtitle={`${replies.length} template`} />
      <Page>
        <div className="mb-3 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari template..." className="h-10 rounded-xl bg-card pl-9 text-sm" />
          </div>
          <Button variant={showFavOnly ? "default" : "outline"} size="icon" className="h-10 w-10 rounded-xl" onClick={() => setShowFavOnly(!showFavOnly)}>
            <Star className={`h-4 w-4 ${showFavOnly ? "fill-current" : ""}`} />
          </Button>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon="💬" title="Belum ada template" />
        ) : (
          <ul className="space-y-2">
            {filtered.map((r) => (
              <li key={r.id} className="rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-soft)]">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-sm font-semibold">{r.title}</p>
                      <span className="rounded-full bg-accent px-1.5 py-0.5 text-[9px] font-medium text-accent-foreground">{r.category}</span>
                    </div>
                  </div>
                  <button onClick={() => update(r.id, { favorite: !r.favorite })}>
                    <Star className={`h-4 w-4 ${r.favorite ? "fill-warning text-warning" : "text-muted-foreground"}`} />
                  </button>
                </div>
                <div className="mt-2 rounded-xl bg-success/10 p-2.5 text-[11px] leading-relaxed text-foreground">
                  {r.body}
                </div>
                <div className="mt-2 flex justify-end gap-1">
                  <Button variant="ghost" size="sm" className="h-7 rounded-lg text-[11px]" onClick={() => remove(r.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 rounded-lg text-[11px]" onClick={() => copy(r.body)}>
                    <Copy className="mr-1 h-3 w-3" /> Copy
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              className="fixed bottom-20 right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full grad-primary text-primary-foreground shadow-[var(--shadow-elevated)] transition hover:scale-105"
              style={{ right: "max(1rem, calc(50vw - 218px))" }}
            >
              <Plus className="h-5 w-5" />
            </button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl">
            <DialogHeader><DialogTitle>Template Baru</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div>
                <Label className="mb-1 text-[11px]">Judul</Label>
                <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
              </div>
              <div>
                <Label className="mb-1 text-[11px]">Kategori</Label>
                <Input value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} />
              </div>
              <div>
                <Label className="mb-1 text-[11px]">Pesan</Label>
                <Textarea rows={4} value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
              </div>
              <Button className="w-full grad-primary text-primary-foreground" onClick={create}>Simpan</Button>
            </div>
          </DialogContent>
        </Dialog>
      </Page>
    </>
  );
}
