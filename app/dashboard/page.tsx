"use client";

import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Activity,
  User as UserIcon,
  History,
  LogOut,
  MapPin,
  Clock,
  Users,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import { toast } from "sonner";

type CurrentRun = {
  id: string;
  title: string;
  court: string;
  time: string;
  players: number;
  maxPlayers: number;
} | null;

type View = "home" | "profile" | "past-runs";

export default function Dashboard (){
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState<View>("home");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    
    fetch("/api/users/me", { credentials: "same-origin" })
      .then((res) => {
        if (!res.ok) {
          router.replace("/");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setUser(data);
          setIsLoading(false);
        } else {
          router.replace("/");
        }
      })
      .catch(() => {
        router.replace("/");
      });
  }, [router]);
  
  // Frontend placeholders — backend will wire these up
  const currentRun: CurrentRun = null; // set to an object to preview the "active" state
  const pastRuns = [
    { id: "1", title: "Sunday Morning Run", court: "Moro Lorenzo Gym", date: "Apr 28, 2026", players: 10 },
    { id: "2", title: "Friday Night Hoops", court: "Blue Eagle Gym", date: "Apr 19, 2026", players: 8 },
    { id: "3", title: "Squad Pickup", court: "Cuneta Astrodome", date: "Apr 12, 2026", players: 12 },
  ];

  const initials = user?.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase() || "U";

  const handleLogout = async () => {
    try {
      await fetch("/api/users/logout", { method: "POST", credentials: "same-origin" });
    } catch {
      // ignore
    }
    toast.success("Logged out");
    router.replace("/");
  };

  const navItems = [
    { id: "home" as View, label: "Home", icon: Activity },
    { id: "profile" as View, label: "Profile", icon: UserIcon },
    { id: "past-runs" as View, label: "Past Runs", icon: History },
  ];
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-soft">
        <div className="text-center">
          <p className="text-secondary">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-soft relative overflow-hidden">
      {/* Decorative blobs — same vibe as landing */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/30 blur-3xl animate-float" />
      <div
        className="pointer-events-none absolute top-1/3 -right-40 h-[28rem] w-[28rem] rounded-full bg-secondary/20 blur-3xl animate-float"
        style={{ animationDelay: "2s" }}
      />

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
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
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="flex-1 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = view === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setView(item.id);
                      setSidebarOpen(false);
                    }}
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
        </aside>

        {/* Backdrop on mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header className="flex items-center justify-between px-4 md:px-8 py-5 border-b border-border/40 backdrop-blur bg-background/40">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="hidden lg:block">
              <h2 className="text-lg font-bold text-secondary capitalize">
                {view === "home" ? "Dashboard" : view.replace("-", " ")}
              </h2>
            </div>
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
          </header>

          {/* Content */}
          <main className="flex-1 p-4 md:p-8 space-y-6">
            {view === "home" && (
              <>
                {/* Current Run */}
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-secondary/70">
                      Current Run
                    </h3>
                  </div>

                  {currentRun ? (
                    <Card className="p-1 bg-gradient-hero shadow-deep border-0 animate-pulse-glow">
                      <div className="rounded-lg bg-background p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                        <div className="flex-1 space-y-2">
                          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/30 px-3 py-1 text-xs font-bold text-primary uppercase">
                            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                            Live
                          </div>
                          {/* <h4 className="text-2xl font-black text-secondary">{currentRun.title}</h4> */}
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <MapPin className="h-4 w-4 text-primary" />
                              {/* {currentRun.court} */}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4 text-primary" />
                              {/* {currentRun.time} */}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Users className="h-4 w-4 text-primary" />
                              {/* {currentRun.players}/{currentRun.maxPlayers} */}
                            </span>
                          </div>
                        </div>
                        <Button
                          size="lg"
                          className="bg-gradient-hero hover:opacity-90 text-primary-foreground font-bold shadow-glow"
                        >
                          View Run <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </Card>
                  ) : (
                    <Card className="p-8 border-2 border-dashed border-border bg-background/50 backdrop-blur text-center">
                      <div className="mx-auto h-14 w-14 rounded-full bg-muted grid place-items-center mb-3">
                        <Activity className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h4 className="text-lg font-bold text-secondary">No current run</h4>
                      <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                        You are not in an active run right now. Join one with a code or host your own.
                      </p>
                      <div className="flex gap-2 justify-center mt-5">
                        <Button className="bg-gradient-hero hover:opacity-90 text-primary-foreground font-bold shadow-glow">
                          Find a Run
                        </Button>
                        <Button
                          variant="outline"
                          className="border-2 border-secondary/30 text-secondary font-bold hover:bg-secondary hover:text-secondary-foreground"
                        >
                          Host a Game
                        </Button>
                      </div>
                    </Card>
                  )}
                </section>

                {/* Quick stats */}
                <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Card className="p-4 bg-background/60 backdrop-blur border-border/60">
                    <MapPin className="h-5 w-5 text-primary mb-2" />
                    <div className="text-xs text-muted-foreground font-semibold uppercase">Courts Nearby</div>
                    <div className="text-2xl font-black text-secondary">12</div>
                  </Card>
                  <Card className="p-4 bg-background/60 backdrop-blur border-border/60">
                    <Users className="h-5 w-5 text-primary mb-2" />
                    <div className="text-xs text-muted-foreground font-semibold uppercase">Hoopers Online</div>
                    <div className="text-2xl font-black text-secondary">248</div>
                  </Card>
                  <Card className="p-4 bg-background/60 backdrop-blur border-border/60 col-span-2 md:col-span-1">
                    <Clock className="h-5 w-5 text-primary mb-2" />
                    <div className="text-xs text-muted-foreground font-semibold uppercase">Runs Tonight</div>
                    <div className="text-2xl font-black text-secondary">7</div>
                  </Card>
                </section>
              </>
            )}

            {view === "profile" && (
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
            )}

            {view === "past-runs" && (
              <div className="space-y-3">
                {pastRuns.map((run) => (
                  <Card
                    key={run.id}
                    className="p-5 bg-background/70 backdrop-blur border-border/60 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                      <div className="flex-1">
                        <h4 className="font-bold text-secondary">{run.title}</h4>
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-1.5">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-primary" />
                            {run.court}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-primary" />
                            {run.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-primary" />
                            {run.players} players
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary font-bold hover:bg-primary/10"
                      >
                        View
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};


