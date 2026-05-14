import { motion } from "framer-motion";

export function Page({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
      className="flex-1 overflow-y-auto px-3 pb-24 pt-3"
    >
      {children}
    </motion.main>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-xs flex-col items-center py-12 text-center">
      <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-2xl">
        {icon ?? "✨"}
      </div>
      <h3 className="text-sm font-semibold">{title}</h3>
      {description && (
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    draft: "bg-muted text-muted-foreground",
    pending: "bg-warning/15 text-warning",
    confirmed: "bg-primary/15 text-primary",
    scheduled: "bg-accent text-accent-foreground",
    completed: "bg-success/15 text-success",
    cancelled: "bg-destructive/15 text-destructive",
    active: "bg-success/15 text-success",
    lead: "bg-warning/15 text-warning",
    inactive: "bg-muted text-muted-foreground",
  };
  const labels: Record<string, string> = {
    draft: "Draft",
    pending: "Pending",
    confirmed: "Confirmed",
    scheduled: "Scheduled",
    completed: "Completed",
    cancelled: "Cancelled",
    active: "Active",
    lead: "Lead",
    inactive: "Inactive",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
        map[status] ?? "bg-muted text-muted-foreground"
      }`}
    >
      {labels[status] ?? status}
    </span>
  );
}
