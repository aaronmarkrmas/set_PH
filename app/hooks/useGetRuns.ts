import { useEffect, useState } from "react";


export function useGetRuns() {
  const [runs, setRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpenRuns = async () => {
      try {
        const response = await fetch("/api/runs?status=open");
        const openRuns = await response.json();
        setRuns(openRuns);
      } catch (error) {
        console.error("Failed to fetch open runs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpenRuns();
  }, []);

  return { runs, loading };
}