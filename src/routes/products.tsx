import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAppStore } from "@/store/app-store";
import { TopBar } from "@/components/top-bar";
import { Page } from "@/components/page";
import { formatIDR } from "@/lib/pricing";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/products")({ component: Products });

function Products() {
  const products = useAppStore((s) => s.products);
  const [open, setOpen] = useState<string | null>(products[0]?.id ?? null);

  return (
    <>
      <TopBar title="Products" subtitle={`${products.length} layanan`} />
      <Page>
        <ul className="space-y-2">
          {products.map((p) => {
            const isOpen = open === p.id;
            return (
              <li key={p.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
                <button
                  onClick={() => setOpen(isOpen ? null : p.id)}
                  className="flex w-full items-center gap-3 p-3 text-left"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-xl">{p.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{p.name}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{p.description}</p>
                  </div>
                  {p.requiresArea && (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[9px] font-semibold text-primary">m²</span>
                  )}
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-border"
                    >
                      <div className="space-y-2 p-3">
                        {p.categories.map((c) => (
                          <div key={c.id}>
                            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{c.name}</p>
                            <ul className="space-y-1">
                              {c.subcategories.map((s) => (
                                <li key={s.id} className="flex items-center justify-between rounded-xl bg-muted/50 px-2.5 py-2 text-[11px]">
                                  <span className="truncate font-medium">{s.name}</span>
                                  <span className="shrink-0 text-right">
                                    {s.oneTimeFee > 0 && <span className="block font-semibold text-foreground">{formatIDR(s.oneTimeFee)}</span>}
                                    {s.monthlyFee > 0 && <span className="block text-[10px] text-muted-foreground">{formatIDR(s.monthlyFee)}{p.requiresArea ? "/m²/bln" : "/bln"}</span>}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </Page>
    </>
  );
}
