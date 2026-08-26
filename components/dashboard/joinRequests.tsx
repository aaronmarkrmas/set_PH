"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X, Clock, UserCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface JoinRequest {
  _id: string;
  guestName: string;
  guestContact: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
}

interface JoinRequestsProps {
  runId: string;
  maxPlayers: number;
  currentParticipants: number;
}

const JoinRequests = ({
  runId,
  maxPlayers,
  currentParticipants,
}: JoinRequestsProps) => {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, [runId]);

  const fetchRequests = async () => {
    try {
      const response = await fetch(`/api/runs/${runId}/join-request`);
      const data = await response.json();
      setRequests(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to load join requests");
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: string, guestName: string) => {
    if (currentParticipants >= maxPlayers) {
      toast.error("Run is full, cannot approve more requests");
      return;
    }

    setProcessing(requestId);
    try {
      const response = await fetch(`/api/runs/${runId}/join-request/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || "Failed to approve request");
        setProcessing(null);
        return;
      }

      toast.success(`${guestName} approved!`);
      setRequests(requests.filter((r) => r._id !== requestId));
      setProcessing(null);
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error("Failed to approve request");
      setProcessing(null);
    }
  };

  const handleReject = async (requestId: string, guestName: string) => {
    setProcessing(requestId);
    try {
      const response = await fetch(`/api/runs/${runId}/join-request/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject" }),
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || "Failed to reject request");
        setProcessing(null);
        return;
      }

      toast.success(`${guestName}'s request rejected`);
      setRequests(requests.filter((r) => r._id !== requestId));
      setProcessing(null);
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Failed to reject request");
      setProcessing(null);
    }
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");

  if (loading) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground text-center">Loading requests...</p>
      </Card>
    );
  }

  if (pendingRequests.length === 0) {
    return (
      <Card className="p-6 border border-border/50">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <UserCheck className="h-4 w-4" />
          <p>No pending join requests</p>
        </div>
      </Card>
    );
  }

  const slotsLeft = maxPlayers - currentParticipants;

  return (
    <div className="space-y-4">
      {slotsLeft <= 0 && (
        <Card className="p-4 bg-orange-50 border border-orange-200">
          <div className="flex items-center gap-2 text-orange-700">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm font-semibold">Your run is full</p>
          </div>
        </Card>
      )}

      <div className="space-y-3">
        {pendingRequests.map((request) => (
          <Card
            key={request._id}
            className="p-4 border border-border/50 bg-gradient-to-r from-primary/5 to-transparent"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-secondary">{request.guestName}</h4>
                  <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                    <Clock className="h-3 w-3" />
                    Pending
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{request.guestContact}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Requested {new Date(request.requestedAt).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleApprove(request._id, request.guestName)}
                  disabled={processing === request._id || slotsLeft <= 0}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button
                  onClick={() => handleReject(request._id, request.guestName)}
                  disabled={processing === request._id}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <p className="text-xs text-muted-foreground px-1">
        {slotsLeft > 0 ? (
          <>You have {slotsLeft} slot{slotsLeft !== 1 ? "s" : ""} available</>
        ) : (
          <>All slots filled</>
        )}
      </p>
    </div>
  );
};

export default JoinRequests;
