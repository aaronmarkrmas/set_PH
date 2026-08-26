"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDashboardUser } from "../hooks/useDashboardUser";
import type { View } from "@/app/types/dashboard";
import Sidebar from "@/components/dashboard/sidebar";
import Topbar from "@/components/dashboard/topbar";
import HomeView from "@/components/dashboard/homeButton";
import ProfileView from "@/components/dashboard/profile";
import PastRunsView from "@/components/dashboard/pastRuns";
import LoadingScreen from "@/components/dashboard/loadingScreen";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const router = useRouter();
  const { user, loading } = useDashboardUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState<View>("home");
  
  if (loading) return <LoadingScreen />;
  if (!user) return null;

  const handleSetView = (newView: View) => {
    if (newView === "create-run") {
      router.push("/dashboard/create-run");
    } else if (newView === "join-run") {
      router.push("/dashboard/join-run");
    } else {
      setView(newView);
    }
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-soft relative overflow-hidden">
      {/* Decorative blobs */}
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
          <Sidebar view={view} setView={handleSetView} onClose={() => setSidebarOpen(false)} />
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
            <div className="hidden lg:block" />
            <Topbar user={user} view={view} />
          </header>

          {/* Content */}
          <main className="flex-1 p-4 md:p-8 space-y-6">
            {view === "home" && <HomeView setView={handleSetView} />}
            {view === "profile" && <ProfileView user={user} />}
            {view === "past-runs" && <PastRunsView />}
          </main>
        </div>
      </div>
    </div>
  );
}


