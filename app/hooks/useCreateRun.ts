import { useState } from "react";
import { toast } from "sonner";

interface CreateRunPayload {
  title: string;
  location: string;
  date: string;
  numOfPlayers?: number;
  joinCode: string;
  status: "open" | "full" | "cancelled" | "completed";
  hostId: string;
}

export function useCreateRun() {
  const [submitting, setSubmitting] = useState(false);

  const createRun = async (payload: CreateRunPayload) => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/runs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create run");
      }

      const data = await response.json();
      console.log("Run created:", data);

      toast.success("Run created!", {
        description: `Join code: ${payload.joinCode}`,
      });

      return data;
    } catch (error) {
      console.error("Error creating run:", error);
      toast.error("Failed to create run. Please try again.");
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  return { createRun, submitting };
}
