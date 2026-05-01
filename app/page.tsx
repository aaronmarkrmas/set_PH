"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { MapPin, Users, Clock, ArrowRight, Activity } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [code, setCode] = useState("");

  const handleQuickJoin = () => {
    if (!code.trim()) {
      toast.error("Enter a run code to join");
      return;
    }
    toast.success(`Joining run ${code.toUpperCase()}...`);
  };

  return (
    <div className="min-h-screen bg-gradient-soft overflow-hidden relative">
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/30 blur-3xl animate-float" />
      <div className="pointer-events-none absolute top-1/3 -right-40 h-[28rem] w-[28rem] rounded-full bg-secondary/20 blur-3xl animate-float" style={{ animationDelay: "2s" }} />

      <header className="relative z-10 container flex items-center justify-between py-6">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-hero grid place-items-center shadow-glow">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-2xl font-black tracking-tight text-secondary">
            Set<span className="text-primary">PH</span>
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-secondary/80">
        </nav>
      </header>

      <main className="relative z-10 container grid lg:grid-cols-2 gap-12 lg:gap-20 items-center py-12 lg:py-20">
        <section className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-secondary">
            <Activity className="h-4 w-4 text-primary" />
            Pickup basketball, organized.
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.95] tracking-tight text-secondary">
            Run with your <span className="text-gradient">squad</span> tonight.
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
            Find open pickup games near you, host your own run, or jump straight into a friend's game with a code. No more group chat chaos — just hoops.
          </p>

  
        </section>

        <section className="space-y-5">
          <Card className="p-3 bg-gradient-hero shadow-deep border-0 animate-pulse-glow">
            <div className="rounded-lg bg-background p-5 space-y-4">
              <div>
                <Label htmlFor="code" className="text-secondary font-bold uppercase text-xs tracking-wider">
                  Quick Join via Code
                </Label>
                <p className="text-sm text-muted-foreground mt-0.5">Got a run code from a friend? Lace up and join.</p>
              </div>
              <div className="flex gap-2">
                <Input
                  id="code"
                  placeholder="RUN CODE"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  maxLength={8}
                  className="h-12 text-lg font-bold tracking-[0.3em] text-center border-2 border-primary/40 focus-visible:ring-primary"
                />
                <Button
                  onClick={handleQuickJoin}
                  size="lg"
                  className="h-12 px-6 bg-gradient-hero hover:opacity-90 text-primary-foreground font-bold shadow-glow"
                >
                  Join <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6 md:p-8 shadow-deep border-2 border-border/50 backdrop-blur">
            <Tabs defaultValue="signup" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted h-12 p-1">
                <TabsTrigger value="signup" className="data-[state=active]:bg-gradient-hero data-[state=active]:text-primary-foreground font-bold h-full">
                  Sign Up
                </TabsTrigger>
                <TabsTrigger value="signin" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground font-bold h-full">
                  Sign In
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signup" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-secondary font-semibold">Hooper Name</Label>
                  <Input id="username" placeholder="kobe24" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-up" className="text-secondary font-semibold">Email</Label>
                  <Input id="email-up" type="email" placeholder="you@setph.com" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pw-up" className="text-secondary font-semibold">Password</Label>
                  <Input id="pw-up" type="password" placeholder="••••••••" className="h-11" />
                </div>
                <Button
                  onClick={() => toast.success("Welcome to SetPH! Time to ball.")}
                  className="w-full h-12 bg-gradient-hero hover:opacity-90 text-primary-foreground font-bold text-base shadow-glow"
                >
                  Create Account
                </Button>
              </TabsContent>

              <TabsContent value="signin" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="email-in" className="text-secondary font-semibold">Email</Label>
                  <Input id="email-in" type="email" placeholder="you@setph.com" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pw-in" className="text-secondary font-semibold">Password</Label>
                  <Input id="pw-in" type="password" placeholder="••••••••" className="h-11" />
                </div>
                <Button
                  onClick={() => toast.success("Welcome back, hooper!")}
                  className="w-full h-12 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-base"
                >
                  Sign In
                </Button>
              </TabsContent>
            </Tabs>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Index;
