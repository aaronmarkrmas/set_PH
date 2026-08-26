"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  CalendarIcon,
  Users,
  CheckCircle2,
  AlertCircle,
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

type JoinRunConfirmationModalProps = {
  run: FoundRun | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isJoining: boolean;
  currentUserId: string;
  joinCode: string;
};

export const JoinRunConfirmationModal = ({
  run,
  isOpen,
  onClose,
  onConfirm,
  isJoining,
  currentUserId,
  joinCode,
}: JoinRunConfirmationModalProps) => {
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setError(null);

    // Check if user is the host
    if (currentUserId === run?.hostId) {
      setError("You cannot join a run you created. You're already the host!");
      return;
    }

    // Call the onConfirm callback to handle the join
    onConfirm();
  };

  if (!run) return null;

  const slotsLeft = run.numOfPlayers
    ? Math.max(0, run.numOfPlayers - run.joinedCount)
    : null;

  const isHost = currentUserId === run.hostId;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-secondary">{run.title}</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground font-semibold uppercase">
            Hosted by {run.hostName}
          </DialogDescription>
        </DialogHeader>

        {/* Error message for host */}
        {isHost && (
          <div className="flex items-start gap-3 rounded-lg bg-destructive/10 border border-destructive/30 p-3">
            <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive font-semibold">
              You already joined this run as the host.
            </p>
          </div>
        )}

        {/* General error message */}
        {error && (
          <div className="flex items-start gap-3 rounded-lg bg-destructive/10 border border-destructive/30 p-3">
            <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive font-semibold">{error}</p>
          </div>
        )}

        {/* Run details */}
        <div className="space-y-3 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-secondary">
              <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="font-semibold">{run.location}</span>
            </div>
            <div className="flex items-center gap-2 text-secondary">
              <CalendarIcon className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="font-semibold">
                {new Date(run.date).toLocaleString()}
              </span>
            </div>
            {run.numOfPlayers !== undefined && (
              <div className="flex items-center gap-2 text-secondary sm:col-span-2">
                <Users className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="font-semibold">
                  {run.joinedCount} / {run.numOfPlayers} players
                </span>
                {slotsLeft !== null && (
                  <span className="ml-auto rounded-full bg-secondary/10 border border-secondary/30 px-2 py-0.5 text-xs font-bold uppercase text-secondary">
                    {slotsLeft} slots left
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Status badge */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground font-semibold">
              Status:
            </span>
            <span className="rounded-full bg-primary/15 border border-primary/30 px-2.5 py-1 text-xs font-bold uppercase text-primary">
              {run.status}
            </span>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isJoining || isHost}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={
              isJoining ||
              isHost ||
              run.status !== "open" ||
              (slotsLeft !== null && slotsLeft === 0)
            }
            className="flex-1 bg-gradient-hero hover:opacity-90 text-primary-foreground font-bold shadow-glow"
          >
            <CheckCircle2 className="h-4 w-4 mr-1" />
            {isJoining ? "Joining..." : "Confirm & Join"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
