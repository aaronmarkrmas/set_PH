import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { DashboardUser, View } from "@/app/types/dashboard";

interface TopbarProps {
  user: DashboardUser;
  view: View;
}

export default function Topbar({ user, view }: TopbarProps) {
  const initials = user.name.split(" ").map((n:string) => n[0]).join("").toUpperCase();

  return (
    <div className="flex items-center gap-3 ml-auto">
      <div className="text-right hidden sm:block">
        <div className="text-sm font-bold text-secondary">{user.name}</div>
        <div className="text-xs text-muted-foreground">@{user.username}</div>
      </div>
      <Avatar className="h-10 w-10 border-2 border-primary/40 shadow-glow">
        <AvatarFallback className="bg-gradient-hero text-primary-foreground font-bold">
          {initials}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}