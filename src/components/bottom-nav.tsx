import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, ShoppingBag, Users, Package, MessageSquareText, Settings } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  { to: "/", label: "Home", icon: LayoutDashboard, exact: true },
  { to: "/orders", label: "Orders", icon: ShoppingBag },
  { to: "/customers", label: "CRM", icon: Users },
  { to: "/products", label: "Products", icon: Package },
  { to: "/replies", label: "Replies", icon: MessageSquareText },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function BottomNav() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  return (
    <nav className="sticky bottom-0 z-30 mt-auto">
      <div className="glass border-t border-border px-1 pb-[env(safe-area-inset-bottom)] pt-1">
        <ul className="grid grid-cols-6">
          {items.map((it) => {
            const active = it.exact ? path === it.to : path.startsWith(it.to);
            const Icon = it.icon;
            return (
              <li key={it.to} className="flex justify-center">
                <Link
                  to={it.to}
                  className="relative flex w-full flex-col items-center gap-0.5 rounded-xl px-1 py-1.5 text-[10px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {active && (
                    <motion.div
                      layoutId="bn-pill"
                      className="absolute inset-x-2 inset-y-1 rounded-xl bg-accent"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <Icon
                    className={`relative h-[18px] w-[18px] ${active ? "text-primary" : ""}`}
                    strokeWidth={active ? 2.4 : 2}
                  />
                  <span className={`relative ${active ? "text-foreground" : ""}`}>{it.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
