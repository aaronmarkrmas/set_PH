"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { DashboardUser } from "@/app/types/dashboard";

interface CreateRunViewProps {
  user: DashboardUser;
}

export default function CreateRunView({ user }: CreateRunViewProps) {
  const [form, setForm] = useState({ title: "", location: "", date: "", numOfPlayers: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          numOfPlayers: parseInt(form.numOfPlayers as unknown as string),
          hostId: user._id,
        }),
      });

      if (!response.ok) throw new Error("Failed to create run");
      
      setForm({ title: "", location: "", date: "", numOfPlayers: 1 });
      alert("Run created successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={submit} className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Input placeholder="Run Title" value={form.title} onChange={(e) => setForm({...form,title:e.target.value})} required />
        <Input placeholder="Location" value={form.location} onChange={(e) => setForm({...form,location:e.target.value})} required />
        <Input type="datetime-local" value={form.date} onChange={(e) => setForm({...form,date:e.target.value})} required />
        <Input type="number" placeholder="Max Players" value={form.numOfPlayers} onChange={(e) => setForm({...form,numOfPlayers:parseInt(e.target.value)})} min="1" required />
        <Button type="submit" className="bg-gradient-hero hover:opacity-90 text-primary-foreground font-bold shadow-glow"disabled={loading}>{loading ? "Creating..." : "Create Run"}</Button>
      </form>
    </Card>
  );
}