"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  UserPlus,
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

const JoinRunPublic = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [joinCode, setJoinCode] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestContact, setGuestContact] = useState("");
  const [searching, setSearching] = useState(false);
  const [joining, setJoining] = useState(false);
  const [foundRun, setFoundRun] = useState<FoundRun | null>(null);
  const [runId, setRunId] = useState<string>("");

  // Pre-fill code from query parameter and auto-search
  useEffect(() => {
    const codeParam = searchParams.get("code");
    if (codeParam) {
      setJoinCode(codeParam);
      // Auto-search for the run
      searchForRun(codeParam);
    }
  }, [searchParams]);

  const searchForRun = async (code: string) => {
    if (!code.trim()) {
      toast.error("Enter a join code first.");
      return;
    }

    setSearching(true);
    try {
      const response = await fetch(
        `/api/runs?joinCode=${encodeURIComponent(code.trim().toUpperCase())}`
      );
      const data = await response.json();

      if (!response.ok || !Array.isArray(data) || data.length === 0) {
        toast.error("Run not found. Check your join code.");
        setSearching(false);
        return;
      }

      const run = data[0]; // Get first matching run
      setRunId(run._id);
      setFoundRun({
        title: run.title,
        location: run.location,
        date: run.date,
        numOfPlayers: run.numOfPlayers,
        joinedCount: run.participants?.length || 0,
        status: run.status,
        hostName: run.hostName,
      });
      setSearching(false);
    } catch (error) {
      console.error("Error finding run:", error);
      toast.error("Failed to find run. Please try again.");
      setSearching(false);
    }
  };

  const handleFind = async (e: React.FormEvent) => {
    e.preventDefault();
    await searchForRun(joinCode);
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundRun || !runId) return;
    if (!guestName.trim()) {
      toast.error("Enter your name to join.");
      return;
    }
    if (!guestContact.trim()) {
      toast.error("Enter an email or phone so the host can reach you.");
      return;
    }

    setJoining(true);
    try {
      const response = await fetch(`/api/runs/${runId}/join-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName: guestName.trim(),
          guestContact: guestContact.trim(),
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to send join request.");
        setJoining(false);
        return;
      }

      toast.success("Request sent!", {
        description: data.message || `${guestName.trim()}'s request has been sent to the host.`,
      });
      setFoundRun(null);
      setRunId("");
      setJoinCode("");
      setGuestName("");
      setGuestContact("");
      setJoining(false);
    } catch (error) {
      console.error("Error sending join request:", error);
      toast.error("Failed to send request. Please try again.");
      setJoining(false);
    }
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
            onClick={() => router.push("/")}
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
            Guest Join
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-secondary">
            Join a <span className="text-primary">Run</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            No account needed. Enter your code and your details to lock in.
          </p>
        </div>

        {/* Lookup */}
        <Card className="p-1 bg-gradient-hero shadow-deep border-0">
          <div className="rounded-lg bg-background p-6 md:p-8 space-y-5">
            <form onSubmit={handleFind} className="space-y-2">
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
            </form>

            {/* Found run + guest form */}
            {foundRun && (
              <form onSubmit={handleJoin} className="space-y-4">
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guestName" className="text-secondary font-bold">
                    Your Name <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id="guestName"
                    placeholder="e.g. Juan Dela Cruz"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    maxLength={60}
                    required
                    className="border-2 border-border focus-visible:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guestContact" className="text-secondary font-bold">
                    Email or Phone <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id="guestContact"
                    placeholder="you@email.com or 0917..."
                    value={guestContact}
                    onChange={(e) => setGuestContact(e.target.value)}
                    maxLength={120}
                    required
                    className="border-2 border-border focus-visible:border-primary"
                  />
                  <p className="text-xs text-muted-foreground">
                    The host uses this to confirm your spot.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={joining || foundRun.status !== "open"}
                  size="lg"
                  className="w-full bg-gradient-hero hover:opacity-90 text-primary-foreground font-bold shadow-glow"
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  {joining
                    ? "Sending Request..."
                    : foundRun.status === "open"
                      ? "Send Join Request"
                      : `Run is ${foundRun.status}`}
                </Button>
              </form>
            )}
          </div>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Have an account?{" "}
          <button
            onClick={() => router.push("/dashboard")}
            className="font-bold text-primary hover:underline"
          >
            Sign in to join faster
          </button>
        </p>
      </div>
    </div>
  );
};

export default JoinRunPublic;
