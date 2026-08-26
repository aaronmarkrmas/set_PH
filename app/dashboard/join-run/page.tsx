"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDashboardUser } from "@/app/hooks/useDashboardUser";
import { JoinRunConfirmationModal } from "@/components/dashboard/joinRunConfirmationModal";
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
} from "lucide-react";
import { toast } from "sonner";

type FoundRun = {
  id: string;
  title: string;
  location: string;
  date: string;
  numOfPlayers?: number;
  joinedCount: number;
  status: "open" | "full" | "cancelled" | "completed";
  hostName: string;
  hostId: string;
};

const JoinRun = () => {
  const router = useRouter();

  const [joinCode, setJoinCode] = useState("");
  const [searching, setSearching] = useState(false);
  const [joining, setJoining] = useState(false);
  const [foundRun, setFoundRun] = useState<FoundRun | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { user, loading } = useDashboardUser();

  // Stub user — backend will replace this with the session user
  if (loading) return <LoadingScreen />;
  if (!user) return null;
  const currentUser = { id: user._id, name: user.name };

  const handleFind = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      toast.error("Enter a join code first.");
      return;
    }

    setSearching(true);
    console.log("Lookup join code:", joinCode.trim().toUpperCase());

    try {
      // Call the runs endpoint to find the run by join code
      const response = await fetch(`/api/runs?joinCode=${joinCode.trim().toUpperCase()}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          toast.error("Run not found", {
            description: "Please check the join code and try again.",
          });
        } else {
          toast.error("Failed to find run");
        }
        setSearching(false);
        return;
      }

      const data = await response.json();
      
      // API returns an array, get the first item
      const run = Array.isArray(data) ? data[0] : data;
      
      if (!run) {
        toast.error("Run not found", {
          description: "Please check the join code and try again.",
        });
        setSearching(false);
        return;
      }
      
      setFoundRun({
        id: run._id,
        title: run.title,
        location: run.location,
        date: run.date,
        numOfPlayers: run.numOfPlayers,
        joinedCount: run.participants?.length || 0,
        status: run.status,
        hostName: run.hostName || "Unknown Host",
        hostId: run.hostId,
      });
      setShowModal(true);
    } catch (error) {
      console.error("Error finding run:", error);
      toast.error("Failed to find run");
    } finally {
      setSearching(false);
    }
  };

  const handleJoin = async () => {
    if (!foundRun) return;
    
    setJoining(true);
    
    try {
      const response = await fetch(`/api/runs/${foundRun.id}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: currentUser.name,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error === "User already joined") {
          toast.error("User already joined", {
            description: "You cannot join a run you created. You're already the host!",
          });
        } else if (errorData.error === "Run is full") {
          toast.error("Run is full", {
            description: "All spots are taken. Try another run.",
          });
        } else {
          toast.error("Failed to join run", {
            description: errorData.error || "Please try again.",
          });
        }
        setJoining(false);
        return;
      }

      toast.success("You're in!", {
        description: `Successfully joined ${foundRun.title}`,
      });

      setShowModal(false);
      setFoundRun(null);
      setJoinCode("");

      setTimeout(() => {
        setJoining(false);
        router.push("/dashboard");
      }, 600);
    } catch (error) {
      console.error("Error joining run:", error);
      toast.error("Failed to join run", {
        description: "An unexpected error occurred.",
      });
      setJoining(false);
    }
  };

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

        {/* Join Run Confirmation Modal */}
        <JoinRunConfirmationModal
          run={foundRun}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleJoin}
          isJoining={joining}
          currentUserId={currentUser.id}
          joinCode={joinCode}
        />
      </div>
    </div>
  );
};

export default JoinRun;
