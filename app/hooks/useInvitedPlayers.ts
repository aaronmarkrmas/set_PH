import { useState } from "react";

export const useInvitedPlayers = (numOfPlayers: string) => {
  const [invitedPlayers, setInvitedPlayers] = useState<string[]>([]);

  // Keep invitedPlayers length in sync with numOfPlayers
  // Host takes 1 slot, so available slots for invited players = numOfPlayers - 1
  const max = numOfPlayers ? Math.max(0, Math.min(50, Number(numOfPlayers)) - 1) : 0;
  if (invitedPlayers.length !== max) {
    if (max > invitedPlayers.length) {
      setInvitedPlayers([...invitedPlayers, ...Array(max - invitedPlayers.length).fill("")]);
    } else {
      setInvitedPlayers(invitedPlayers.slice(0, max));
    }
  }

  const filledCount = invitedPlayers.filter((p) => p.trim() !== "").length;
  const maxPlayers = invitedPlayers.length;
  const availableSlots = Math.max(0, maxPlayers - filledCount);

  const updateInvitedPlayer = (index: number, value: string) => {
    setInvitedPlayers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  return {
    invitedPlayers,
    updateInvitedPlayer,
    filledCount,
    maxPlayers,
    availableSlots,
  };
};
