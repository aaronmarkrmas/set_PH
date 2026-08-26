import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { DashboardUser } from "@/app/types/dashboard";

interface ProfileViewProps {
  user: DashboardUser;
}

export default function ProfileView({ user }: ProfileViewProps) {
  const initials = user.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="p-6 md:p-8 bg-background/70 backdrop-blur border-2 border-border/50 shadow-deep">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <Avatar className="h-24 w-24 border-4 border-primary/40 shadow-glow">
          <AvatarFallback className="bg-gradient-hero text-primary-foreground font-black text-2xl">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center sm:text-left space-y-1">
          <h3 className="text-2xl font-black text-secondary">{user.name}</h3>
          <p className="text-primary font-bold">@{user.username}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <Button
          variant="outline"
          className="border-2 border-primary/40 text-secondary font-bold hover:bg-primary hover:text-primary-foreground"
        >
          Edit Profile
        </Button>
      </div>
    </Card>
  );
}