import { Activity, User, History, PlusCircle, LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { View } from "@/app/types/dashboard";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SidebarItem {
  id: View;
  label: string;
  icon: typeof Activity;
}

const items: SidebarItem[] = [
  { id: "home", label: "Home", icon: Activity },
  { id: "create-run", label: "Create Run", icon: PlusCircle },
  { id: "profile", label: "Profile", icon: User },
  { id: "past-runs", label: "Past Runs", icon: History },
];

interface SidebarProps {
  view: View;
  setView: (view: View) => void;
  onClose?: () => void;
}

export default function Sidebar({ view, setView, onClose }: SidebarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/users/logout", { method: "POST", credentials: "same-origin" });
    } catch {
      // ignore
    }
    toast.success("Logged out");
    router.replace("/");
  };

  return (
    <div className="h-full bg-background/80 backdrop-blur border-r border-border/60 flex flex-col p-4">
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-hero grid place-items-center shadow-glow">
            <Activity className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-black tracking-tight text-secondary">
            Set<span className="text-primary">PH</span>
          </span>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <nav className="flex-1 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = view === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                active
                  ? "bg-gradient-hero text-primary-foreground shadow-glow"
                  : "text-secondary/80 hover:bg-muted hover:text-secondary"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <Button
        onClick={handleLogout}
        variant="outline"
        className="w-full justify-start gap-3 border-2 border-secondary/20 text-secondary hover:bg-secondary hover:text-secondary-foreground font-bold"
      >
        <LogOut className="h-4 w-4" />
        Log Out
      </Button>
    </div>
  );
    }