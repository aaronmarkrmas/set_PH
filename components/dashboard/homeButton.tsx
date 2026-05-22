"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PastRunsView from "@/components/dashboard/pastRuns";
import JoinRequests from "@/components/dashboard/joinRequests";
import type { View } from "@/app/types/dashboard";
import { Activity, MapPin, Clock, Users, ArrowRight, Bell, Share2, Copy, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetRuns } from "@/app/hooks/useGetRuns";
import { useDashboardUser } from "@/app/hooks/useDashboardUser";
import { useCompleteRun } from "@/app/hooks/useCompleteRun";
import { useState } from "react";
interface HomeViewProps {
  setView: (view: View) => void;
}

export default function HomeView({ setView }: HomeViewProps) {
  const { user } = useDashboardUser();
  const { runs, loading } = useGetRuns();
  const { showConfirm, openConfirm, closeConfirm, confirmComplete } = useCompleteRun();
  const [selectedRun, setSelectedRun] = useState<any>(null);
  const [showRequests, setShowRequests] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [selectedRunForShare, setSelectedRunForShare] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  // Filter runs to show only ones where user is a participant (host or joiner)
  const userRuns = runs.filter((run) => {
    const isHost = run.hostId === user?._id;
    const isJoiner = run.participants?.some((p: any) => p.userId?.toString() === user?._id);
    return isHost || isJoiner;
  });

  return (
    <>
      {/* Current Runs */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-secondary/70">
            Open Runs
          </h3>
        </div>

        {userRuns.length > 0 ? (
          <div className="grid gap-4">
            {userRuns.map((run) => (
              <Card key={run._id} className="p-1 bg-gradient-hero shadow-deep border-0 animate-pulse-glow">
                <div className="rounded-lg bg-background p-6 flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <h1 className="font-bold text-xl">{run?.title}</h1> <span className="text-sm text-muted-foreground"></span> 
                         {(run?.hostId === user?._id) ? (
                            <span>Host</span>
                          ) : (
                            <span>Joiner</span>
                          )}
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 border border-green-500/30 px-3 py-1 text-xs font-bold text-green-500 uppercase">
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            {run?.status}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 hover:bg-primary/10"
                            onClick={() => {
                              setSelectedRunForShare(run);
                              setShowShare(true);
                              setCopied(false);
                            }}
                          >
                            <Share2 className="h-4 w-4 text-primary" />
                          </Button>
                        </div>
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
                      
                      <div className="space-y-0 flex flex-col h-full">
                        <div className="flex items-center justify-between gap-1 mb-2">
                          <p className="text-xs font-bold uppercase tracking-wider text-black">
                            Participants ({run?.participants?.length || 0})
                          </p>
                          <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-glow"
                            onClick={() => {
                              setSelectedRun(run);
                              setShowRequests(true);
                            }}
                          >
                            <Bell className="h-4 w-4 mr-1" />
                            Requests
                          </Button>
                        </div>
                        <div className="space-y-1 flex-1">
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
                        {run?.hostId === user?._id && (
                          <div className="flex justify-end mt-3">
                            <Button
                              size="lg"
                              className="bg-gradient-hero hover:opacity-90 text-primary-foreground font-bold shadow-glow"
                              onClick={() => openConfirm(run._id)}
                            >
                              Complete run 
                            </Button>
                          </div>
                        )}
                      </div>
                      
                    </div>
                  </div>
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

      {/* Join Requests Dialog */}
      <Dialog open={showRequests} onOpenChange={setShowRequests}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Join Requests for {selectedRun?.title}</DialogTitle>
          </DialogHeader>
          {selectedRun && (
            <JoinRequests
              runId={selectedRun._id}
              maxPlayers={selectedRun.numOfPlayers || 10}
              currentParticipants={selectedRun.participants?.length || 0}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Share Invitation Dialog */}
      <Dialog open={showShare} onOpenChange={setShowShare}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Share Run Invitation</DialogTitle>
          </DialogHeader>
          {selectedRunForShare && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4 space-y-3">
                <p className="text-sm text-muted-foreground">
                  {user?.name || user?.email} invites you to join <span className="font-bold text-foreground">{selectedRunForShare?.title}</span> with the code <span className="font-mono font-bold text-foreground">{selectedRunForShare?.joinCode}</span>. Visit the link below and paste the code to join!
                </p>
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold">Link:</span>{" "}
                  <a 
                    href={`${typeof window !== 'undefined' ? window.location.origin : ''}/join`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 font-semibold underline"
                  >
                    {typeof window !== 'undefined' ? window.location.origin : ''}/join
                  </a>
                </p>
              </div>
              <Button
                onClick={() => {
                  const inviteText = `${user?.name || user?.email} invites you to join ${selectedRunForShare?.title} with the code ${selectedRunForShare?.joinCode}. Visit ${typeof window !== 'undefined' ? window.location.origin : ''}/join and paste the code to join!`;
                  navigator.clipboard.writeText(inviteText);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="w-full bg-gradient-hero hover:opacity-90 text-primary-foreground font-bold"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Invitation
                  </>
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    
    </>
  );
}