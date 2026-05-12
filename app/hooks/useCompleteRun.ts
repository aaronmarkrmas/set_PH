import { useRouter } from "next/navigation";
import { useState } from "react";

export function useCompleteRun() {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);

  const openConfirm = (runId: string) => {
    setSelectedRunId(runId);
    setShowConfirm(true);
  };

  const closeConfirm = () => {
    setShowConfirm(false);
    setSelectedRunId(null);
  };

  const confirmComplete = async () => {
    if (!selectedRunId) return;
    try {
      const response = await fetch(`/api/runs/${selectedRunId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" })
      });
      if (response.ok) {
        closeConfirm();
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to complete run:", error);
    }
  };

  return { showConfirm, openConfirm, closeConfirm, confirmComplete };
}
