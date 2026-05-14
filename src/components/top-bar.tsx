import { ArrowLeft, Bell, Moon, Sun } from "lucide-react";
import { Link, useRouter } from "@tanstack/react-router";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";

interface Props {
  title: string;
  subtitle?: string;
  back?: boolean;
  right?: React.ReactNode;
}

export function TopBar({ title, subtitle, back, right }: Props) {
  const router = useRouter();
  const theme = useAppStore((s) => s.theme);
  const toggle = useAppStore((s) => s.toggleTheme);

  return (
    <header className="sticky top-0 z-30 glass border-b border-border">
      <div className="flex items-center gap-2 px-3 py-3">
        {back ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full"
            onClick={() => router.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        ) : (
          <Link to="/" className="flex h-9 w-9 items-center justify-center rounded-xl grad-primary text-primary-foreground shadow-md">
            <span className="text-sm font-bold">A</span>
          </Link>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-semibold leading-tight">{title}</h1>
          {subtitle && (
            <p className="truncate text-[11px] text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {right}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full"
          onClick={toggle}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
          <Bell className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
