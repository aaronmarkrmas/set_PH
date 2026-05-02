"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

interface Run {
  _id: string;
  title: string;
  location: string;
  date: string;
  hostId: string;
}

export default function PastRunsView() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRuns = async () => {
      try {
        const response = await fetch("/api/runs");
        if (!response.ok) throw new Error("Failed to fetch runs");
        const data = await response.json();
        setRuns(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchRuns();
  }, []);

  if (loading) return <p>Loading runs...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-3">
      {runs.length === 0 ? (
        <p className="text-muted-foreground">No runs found</p>
      ) : (
        runs.map((run) => (
          <Card key={run._id} className="p-4">
            <h3 className="font-bold">{run.title}</h3>
            <p className="text-sm text-muted-foreground">{run.location}</p>
            <p className="text-xs text-muted-foreground">{new Date(run.date).toLocaleString()}</p>
          </Card>
        ))
      )}
    </div>
  );
}