export const createRunAPI = async (payload: any) => {
  const response = await fetch("/api/runs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create run");
  }

  return response.json();
};

export const addParticipantAPI = async (
  runId: string,
  data: {
    userId?: string;
    name: string;
    status: "going" | "invited" | "cancelled";
  }
) => {
  const response = await fetch(`/api/runs/${runId}/participants`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to add participant");
  }

  return response.json();
};

export const addRunParticipants = async (
  runId: string,
  userId: string,
  userName: string,
  invitedPlayers: string[]
) => {
  // Add host as first participant
  await addParticipantAPI(runId, {
    userId,
    name: userName,
    status: "going",
  });

  // Add invited players as participants
  const invitedPlayerNames = invitedPlayers.map((p) => p.trim()).filter(Boolean);
  for (const playerName of invitedPlayerNames) {
    await addParticipantAPI(runId, {
      name: playerName,
      status: "invited",
    });
  }
};
