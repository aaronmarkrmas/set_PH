"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PastRunsView from "@/components/dashboard/pastRuns";
import type { View } from "@/app/types/dashboard";
import { Activity, MapPin, Clock, Users, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetRuns } from "@/app/hooks/useGetRuns";
import { useDashboardUser } from "@/app/hooks/useDashboardUser";
import { useCompleteRun } from "@/app/hooks/useCompleteRun";
interface HomeViewProps {
  setView: (view: View) => void;
}

export default function HomeView({ setView }: HomeViewProps) {
  const { user } = useDashboardUser();
  const { runs, loading } = useGetRuns();
  const { showConfirm, openConfirm, closeConfirm, confirmComplete } = useCompleteRun();
  const router = useRouter();

  return (
    <>
      {/* Current Runs */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-secondary/70">
            Open Runs
          </h3>
        </div>

        {runs.length > 0 ? (
          <div className="grid gap-4">
            {runs.map((run) => (
              <Card key={run._id} className="p-1 bg-gradient-hero shadow-deep border-0 animate-pulse-glow">
                <div className="rounded-lg bg-background p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h1 className="font-bold text-xl">{run?.title}</h1> <span className="text-sm text-muted-foreground"></span> 
                       {(run?.hostId === user?._id) ? (
                          <span>Host</span>
                        ) : (
                          <span>Joiner</span>
                        )}
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 border border-green-500/30 px-3 py-1 text-xs font-bold text-green-500 uppercase">
                        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        {run?.status}
                      </span>
                    </div> 
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{run?.location}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{new Date(run?.date).toLocaleString()}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        {(run?.numOfPlayers === null || run?.numOfPlayers === undefined) ? (
                          <span>Max players not set</span>
                        ) : (
                          <span>Max: {run?.numOfPlayers} players</span>
                        )}
                      </p>
                      <p className="font-semibold text-primary">Code: {run?.joinCode}</p>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-0">
                    <div className="space-y-0">
                      <p className="text-xs font-bold uppercase tracking-wider text-secondary/70">
                        Participants ({run?.participants?.length || 0})
                      </p>
                      <div className="space-y-1">
                        {run?.participants && run.participants.length > 0 ? (
                          run.participants.map((participant: any, idx: number) => (
                            <p key={idx} className="text-sm text-muted-foreground">
                              {participant?.name || "Unknown"}
                            </p>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No participants yet</p>
                        )}
                      </div>
                    </div>
                    
                  </div>
                  <Button
                      size="lg"
                      className="bg-gradient-hero hover:opacity-90 text-primary-foreground font-bold shadow-glow mt-auto"
                      onClick={() => openConfirm(run._id)}
                    >
                      Complete run 
                    </Button>
                </div>
              </Card>
            ))}
          </div>
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
                onClick={() => router.push("/dashboard/create-run")}
              >
                Host a Game
              </Button>
            </div>
          </Card>
        )}
      </section>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur">
          <Card className="p-1 bg-gradient-hero shadow-deep border-0 w-96">
            <div className="rounded-lg bg-background p-6 space-y-4">
              <h2 className="text-xl font-bold">Complete Run?</h2>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to mark this run as completed? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  className="border-2 border-secondary/30 text-secondary font-bold hover:bg-secondary hover:text-secondary-foreground"
                  onClick={closeConfirm}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-hero hover:opacity-90 text-primary-foreground font-bold shadow-glow"
                  onClick={() => {
                    confirmComplete();
                    setTimeout(() => setView("past-runs"), 500);
                  }} 
                >
                  Complete Run
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    
    </>
  );
}