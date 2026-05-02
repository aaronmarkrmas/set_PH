import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { View } from "@/app/types/dashboard";
import { Activity, MapPin, Clock, Users, ArrowRight } from "lucide-react";

interface HomeViewProps {
  setView: (view: View) => void;
}

export default function HomeView({ setView }: HomeViewProps) {
  const currentRun = null; // set to an object to preview the "active" state

  return (
    <>
      {/* Current Run */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-secondary/70">
            Current Run
          </h3>
        </div>

        {currentRun ? (
          <Card className="p-1 bg-gradient-hero shadow-deep border-0 animate-pulse-glow">
            <div className="rounded-lg bg-background p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
              <div className="flex-1 space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/30 px-3 py-1 text-xs font-bold text-primary uppercase">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  Live
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-primary" />
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-primary" />
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-primary" />
                  </span>
                </div>
              </div>
              <Button
                size="lg"
                className="bg-gradient-hero hover:opacity-90 text-primary-foreground font-bold shadow-glow"
              >
                View Run <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-8 border-2 border-dashed border-border bg-background/50 backdrop-blur text-center">
            <div className="mx-auto h-14 w-14 rounded-full bg-muted grid place-items-center mb-3">
              <Activity className="h-6 w-6 text-muted-foreground" />
            </div>
            <h4 className="text-lg font-bold text-secondary">No current run</h4>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
              You are not in an active run right now. Join one with a code or host your own.
            </p>
            <div className="flex gap-2 justify-center mt-5">
              <Button className="bg-gradient-hero hover:opacity-90 text-primary-foreground font-bold shadow-glow">
                Find a Run
              </Button>
              <Button
                variant="outline"
                className="border-2 border-secondary/30 text-secondary font-bold hover:bg-secondary hover:text-secondary-foreground"
                onClick={() => setView("create-run")}
              >
                Host a Game
              </Button>
            </div>
          </Card>
        )}
      </section>

      {/* Quick stats */}
      <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-background/60 backdrop-blur border-border/60">
          <MapPin className="h-5 w-5 text-primary mb-2" />
          <div className="text-xs text-muted-foreground font-semibold uppercase">Courts Nearby</div>
          <div className="text-2xl font-black text-secondary">12</div>
        </Card>
        <Card className="p-4 bg-background/60 backdrop-blur border-border/60">
          <Users className="h-5 w-5 text-primary mb-2" />
          <div className="text-xs text-muted-foreground font-semibold uppercase">Hoopers Online</div>
          <div className="text-2xl font-black text-secondary">248</div>
        </Card>
        <Card className="p-4 bg-background/60 backdrop-blur border-border/60 col-span-2 md:col-span-1">
          <Clock className="h-5 w-5 text-primary mb-2" />
          <div className="text-xs text-muted-foreground font-semibold uppercase">Runs Tonight</div>
          <div className="text-2xl font-black text-secondary">7</div>
        </Card>
      </section>
    </>
  );
}