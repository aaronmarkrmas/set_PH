import { useEffect, useState, useCallback } from "react";


export function useGetRuns() {
  const [runs, setRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOpenRuns = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/runs?status=open");
      const openRuns = await response.json();
      setRuns(openRuns);
    } catch (error) {
      console.error("Failed to fetch open runs:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOpenRuns();
  }, [fetchOpenRuns]);

  return { runs, loading, refetch: fetchOpenRuns };
}