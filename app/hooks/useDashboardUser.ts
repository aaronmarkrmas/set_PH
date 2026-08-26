"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { DashboardUser } from "@/app/types/dashboard";

export function useDashboardUser() {
  const router = useRouter();

  const [user, setUser] = useState<DashboardUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users/me")
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => router.replace("/"));
  }, []);

  return { user, loading };
}