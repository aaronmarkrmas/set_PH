export type View =
  | "home"
  | "create-run"
  | "profile"
  | "join-run"
  | "past-runs";

export type DashboardUser = {
  _id: string;
  name: string;
  username: string;
  email: string;
};

export type CurrentRun = {
  id: string;
  title: string;
  court: string;
  time: string;
  players: number;
  maxPlayers: number;
} | null;