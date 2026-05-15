"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDashboardUser } from "@/app/hooks/useDashboardUser";
import LoadingScreen from "@/components/dashboard/loadingScreen";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Activity,
  Hash,
  ArrowLeft,
  Sparkles,
  MapPin,
  CalendarIcon,
  Users,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

type FoundRun = {
  title: string;
  location: string;
  date: string;
  numOfPlayers?: number;
  joinedCount: number;
  status: "open" | "full" | "cancelled" | "completed";
  hostName: string;
};

const JoinRun = () => {
  const router = useRouter();

  const [joinCode, setJoinCode] = useState("");
  const [searching, setSearching] = useState(false);
  const [joining, setJoining] = useState(false);
  const [foundRun, setFoundRun] = useState<FoundRun | null>(null);
  const { user, loading } = useDashboardUser();

  // Stub user — backend will replace this with the session user
  if (loading) return <LoadingScreen />;
  if (!user) return null;
  const currentUser = { name: user.name };

  const handleFind = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      toast.error("Enter a join code first.");
      return;
    }

    setSearching(true);
    console.log("Lookup join code:", joinCode.trim().toUpperCase());

    // Mock lookup — backend will replace this
    setTimeout(() => {
      setFoundRun({
        title: "Sunday Morning Run",
        location: "Moro Lorenzo Gym",
        date: new Date(Date.now() + 86400000).toISOString(),
        numOfPlayers: 10,
        joinedCount: 6,
        status: "open",
        hostName: "Coach Mike",
      });
      setSearching(false);
    }, 500);
  };

  const handleJoin = () => {
    if (!foundRun) return;
    setJoining(true);
    console.log("Join run payload:", {
      joinCode: joinCode.trim().toUpperCase(),
      // userId attached by backend from session
    });
    toast.success("You're in!", {
      description: `Joined ${foundRun.title}`,
    });
    setTimeout(() => {
      setJoining(false);
      router.push("/dashboard");
    }, 600);
  };

  const slotsLeft = foundRun?.numOfPlayers
    ? Math.max(0, foundRun.numOfPlayers - foundRun.joinedCount)
    : null;

  return (
    <div className="min-h-screen bg-gradient-soft relative overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/30 blur-3xl animate-float" />
      <div
        className="pointer-events-none absolute top-1/3 -right-40 h-[28rem] w-[28rem] rounded-full bg-secondary/20 blur-3xl animate-float"
        style={{ animationDelay: "2s" }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="text-secondary font-semibold hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-hero grid place-items-center shadow-glow">
              <Activity className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-black tracking-tight text-secondary">
              Set<span className="text-primary">PH</span>
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/30 px-3 py-1 text-xs font-bold text-primary uppercase mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Join a Game
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-secondary">
            Hop in a <span className="text-primary">Run</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Got a code? Drop it below and lock in your spot.
          </p>
        </div>

        {/* Join code form */}
        <Card className="p-1 bg-gradient-hero shadow-deep border-0">
          <div className="rounded-lg bg-background p-6 md:p-8">
            <form onSubmit={handleFind} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="joinCode" className="text-secondary font-bold">
                  Join Code <span className="text-primary">*</span>
                </Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                    <Input
                      id="joinCode"
                      placeholder="ABC123"
                      value={joinCode}
                      onChange={(e) => {
                        setJoinCode(e.target.value.toUpperCase());
                        setFoundRun(null);
                      }}
                      maxLength={12}
                      required
                      className="pl-9 border-2 border-border focus-visible:border-primary font-mono font-bold tracking-widest uppercase"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={searching}
                    className="bg-gradient-hero hover:opacity-90 text-primary-foreground font-bold shadow-glow"
                  >
                    {searching ? "Searching..." : "Find Run"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Signed in as <span className="font-bold text-secondary">{currentUser.name}</span>
                </p>
              </div>

              {/* Found run preview */}
              {foundRun && (
                <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-black text-secondary">
                        {foundRun.title}
                      </h3>
                      <p className="text-xs text-muted-foreground font-semibold uppercase">
                        Hosted by {foundRun.hostName}
                      </p>
                    </div>
                    <span className="rounded-full bg-primary/15 border border-primary/30 px-2.5 py-1 text-xs font-bold uppercase text-primary">
                      {foundRun.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-secondary">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-semibold">{foundRun.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-secondary">
                      <CalendarIcon className="h-4 w-4 text-primary" />
                      <span className="font-semibold">
                        {new Date(foundRun.date).toLocaleString()}
                      </span>
                    </div>
                    {foundRun.numOfPlayers !== undefined && (
                      <div className="flex items-center gap-2 text-secondary sm:col-span-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="font-semibold">
                          {foundRun.joinedCount} / {foundRun.numOfPlayers} players
                        </span>
                        {slotsLeft !== null && (
                          <span className="ml-auto rounded-full bg-secondary/10 border border-secondary/30 px-2 py-0.5 text-xs font-bold uppercase text-secondary">
                            {slotsLeft} slots left
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <Button
                    type="button"
                    onClick={handleJoin}
                    disabled={joining || foundRun.status !== "open"}
                    size="lg"
                    className="w-full bg-gradient-hero hover:opacity-90 text-primary-foreground font-bold shadow-glow"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    {joining
                      ? "Joining..."
                      : foundRun.status === "open"
                        ? "Confirm & Join"
                        : `Run is ${foundRun.status}`}
                  </Button>
                </div>
              )}
            </form>
          </div>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don&apos;t have a code?{" "}
          <button
            onClick={() => router.push("/dashboard")}
            className="font-bold text-primary hover:underline"
          >
            Host a run or ask the host for the code
          </button>
        </p>
      </div>
    </div>
  );
};

export default JoinRun;
