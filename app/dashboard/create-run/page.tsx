"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDashboardUser } from "@/app/hooks/useDashboardUser";
import { useCreateRun } from "@/app/hooks/useCreateRun";
import { useInvitedPlayers } from "@/app/hooks/useInvitedPlayers";
import { usePlayerNavigation } from "@/app/hooks/usePlayerNavigation";
import { addRunParticipants } from "@/app/services/runService";
import LoadingScreen from "@/components/dashboard/loadingScreen";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Activity,
  MapPin,
  CalendarIcon,
  Users,
  Hash,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type RunStatus = "open" | "full" | "cancelled" | "completed";

const generateJoinCode = () =>
  Math.random().toString(36).slice(2, 8).toUpperCase();

const CreateRun = () => {
  const router = useRouter();
  const { createRun, submitting } = useCreateRun();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState("");
  const [numOfPlayers, setNumOfPlayers] = useState<string>("");
  const [status, setStatus] = useState<RunStatus>("open");
  const [joinCode, setJoinCode] = useState(generateJoinCode());
  const { user, loading } = useDashboardUser();
  const { invitedPlayers, updateInvitedPlayer, filledCount, maxPlayers, availableSlots } = useInvitedPlayers(numOfPlayers);
  const { playerRefs, handlePlayerKeyDown } = usePlayerNavigation(invitedPlayers.length);

  if (loading) return <LoadingScreen />;
  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !location.trim() || !date) {
      toast.error("Please fill in title, location, and date.");
      return;
    }

    // Combine date + time into a single Date
    const finalDate = new Date(date);
    if (time) {
      const [h, m] = time.split(":").map(Number);
      finalDate.setHours(h || 0, m || 0, 0, 0);
    }

    const payload = {
      title: title.trim(),
      location: location.trim(),
      date: finalDate.toISOString(),
      numOfPlayers: numOfPlayers ? Number(numOfPlayers) : undefined,
      joinCode,
      status,
      hostId: user._id,
    };

    try {
      const runResponse = await createRun(payload);
      const runId = runResponse._id || runResponse.id;

      // Add host and invited players as participants
      await addRunParticipants(runId, user._id, user.name || "Host", invitedPlayers);

      setTimeout(() => {
        router.push("/dashboard");
      }, 600);
    } catch (error) {
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/30 blur-3xl animate-float" />
      <div
        className="pointer-events-none absolute top-1/3 -right-40 h-[28rem] w-[28rem] rounded-full bg-secondary/20 blur-3xl animate-float"
        style={{ animationDelay: "2s" }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="text-secondary font-semibold hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-hero grid place-items-center shadow-glow">
              <Activity className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-black tracking-tight text-secondary">
              Set<span className="text-primary">PH</span>
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/30 px-3 py-1 text-xs font-bold text-primary uppercase mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Host a Game
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-secondary">
            Create a <span className="text-primary">Run</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Set the court, the time, and rally your hoopers.
          </p>
        </div>

        {/* Form Card */}
        <Card className="p-1 bg-gradient-hero shadow-deep border-0">
          <div className="rounded-lg bg-background p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-secondary font-bold">
                  Run Title <span className="text-primary">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g. Sunday Morning Run"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                  required
                  className="border-2 border-border focus-visible:border-primary"
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-secondary font-bold">
                  Location <span className="text-primary">*</span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                  <Input
                    id="location"
                    placeholder="e.g. Moro Lorenzo Gym"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    maxLength={200}
                    required
                    className="pl-9 border-2 border-border focus-visible:border-primary"
                  />
                </div>
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-secondary font-bold">
                    Date <span className="text-primary">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal border-2",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time" className="text-secondary font-bold">
                    Time
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="border-2 border-border focus-visible:border-primary"
                  />
                </div>
              </div>

              {/* Num players + Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="players" className="text-secondary font-bold">
                    Number of Players
                  </Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                    <Input
                      id="players"
                      type="number"
                      min={1}
                      max={50}
                      placeholder="10"
                      value={numOfPlayers}
                      onChange={(e) => setNumOfPlayers(e.target.value)}
                      className="pl-9 border-2 border-border focus-visible:border-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-secondary font-bold">Status</Label>
                  <Select value={status} onValueChange={(v) => setStatus(v as RunStatus)}>
                    <SelectTrigger className="border-2 border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="full">Full</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Add Players */}
              <div className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <Label className="text-secondary font-bold">
                    Invite Players
                  </Label>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase">
                    <span className="rounded-full bg-primary/10 border border-primary/30 px-2.5 py-1 text-primary">
                      1 / {numOfPlayers || 0} max
                    </span>
                    <span className="rounded-full bg-secondary/10 border border-secondary/30 px-2.5 py-1 text-secondary">
                      {Math.max(0, (numOfPlayers ? Number(numOfPlayers) : 0) - 1)} open
                    </span>
                  </div>
                </div>

                {maxPlayers === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Set the number of players above to add invites.
                  </p>
                ) : (
                  <>
                    <div className="relative rounded-lg border-2 border-primary/50 bg-primary/5 p-3">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 grid place-items-center rounded-full bg-primary text-primary-foreground text-[10px] font-black">
                        1
                      </span>
                      <p className="pl-10 text-sm font-semibold text-secondary">{user.name || "You (Host)"}</p>
                      <p className="pl-10 text-xs text-muted-foreground">Host</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {invitedPlayers.map((player, i) => (
                        <div key={i} className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 grid place-items-center rounded-full bg-primary/15 text-primary text-[10px] font-black">
                            {i + 2}
                          </span>
                        <Input
                          ref={(el) => {
                            playerRefs.current[i] = el;
                          }}
                          placeholder={`Player ${i + 2} name or @handle`}
                          value={player}
                          onChange={(e) => updateInvitedPlayer(i, e.target.value)}
                          onKeyDown={(e) => handlePlayerKeyDown(e, i)}
                          maxLength={60}
                          className="pl-10 border-2 border-border focus-visible:border-primary"
                        />
                      </div>
                    ))}
                    </div>
                  </>
                )}
              </div>

              {/* Join code */}
              <div className="space-y-2">
                <Label htmlFor="joinCode" className="text-secondary font-bold">
                  Join Code <span className="text-primary">*</span>
                </Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                    <Input
                      id="joinCode"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      maxLength={12}
                      required
                      className="pl-9 border-2 border-border focus-visible:border-primary font-mono font-bold tracking-widest uppercase"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setJoinCode(generateJoinCode())}
                    className="border-2 border-secondary/30 text-secondary font-bold hover:bg-secondary hover:text-secondary-foreground"
                  >
                    Generate
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Share this with hoopers so they can join your run.
                </p>
              </div>

              {/* Submit */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  size="lg"
                  className="flex-1 bg-gradient-hero hover:opacity-90 text-primary-foreground font-bold shadow-glow"
                >
                  {submitting ? "Creating..." : "Create Run"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => router.push("/dashboard")}
                  className="border-2 border-secondary/30 text-secondary font-bold hover:bg-secondary hover:text-secondary-foreground"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CreateRun;
