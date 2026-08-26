"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Mail, ShieldCheck, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface PinVerifyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onVerify: (pin: string) => void | Promise<void>;
  onResend?: () => Promise<number | null>;
}

const PIN_LENGTH = 6;

export function PinVerifyModal({
  open,
  onOpenChange,
  email,
  onVerify,
  onResend,
}: PinVerifyModalProps) {
  const [pin, setPin] = useState<string[]>(new Array(PIN_LENGTH).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(120);
  const [isResending, setIsResending] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
  if (resendCooldown <= 0) return;

  const timer = setInterval(() => {
    setResendCooldown((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(timer);
  }, [resendCooldown]);

  useEffect(() => {
  if (open) {
    setPin(new Array(PIN_LENGTH).fill(""));
    setError("");
    setIsVerifying(false);
    setResendCooldown(120);

    setTimeout(() => inputsRef.current[0]?.focus(), 50);
  }
  }, [open]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    setError("");
    const digit = value.slice(-1);
    const nextPin = [...pin];
    nextPin[index] = digit;
    setPin(nextPin);

    if (digit && index < PIN_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    if (nextPin.every((p) => p !== "")) {
      submit(nextPin.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, PIN_LENGTH);
    if (!pasted) return;

    const nextPin = pasted.split("").concat(new Array(PIN_LENGTH - pasted.length).fill(""));
    setPin(nextPin);
    inputsRef.current[Math.min(pasted.length, PIN_LENGTH - 1)]?.focus();

    if (pasted.length === PIN_LENGTH) {
      submit(pasted);
    }
  };

  const submit = async (code: string) => {
    setIsVerifying(true);
    setError("");
    try {
      await onVerify(code);
    } catch (err) {
      setError("Invalid code. Please try again.");
      setPin(new Array(PIN_LENGTH).fill(""));
      inputsRef.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
  if (!onResend || isResending) {
    return;
  }

  setIsResending(true);
  setPin(new Array(PIN_LENGTH).fill(""));
  setError("");

  try {
    const remainingSeconds = await onResend();

    if (remainingSeconds !== null) {
      setResendCooldown(remainingSeconds);
    }
  } finally {
    setIsResending(false);
  }

  inputsRef.current[0]?.focus();
};

  const filled = pin.every((p) => p !== "");
  const formatCooldown = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-2 border-primary/30 bg-background/95 backdrop-blur shadow-deep">
        <DialogHeader className="space-y-3">
          <div className="mx-auto h-14 w-14 rounded-full bg-gradient-hero grid place-items-center shadow-glow">
            <Mail className="h-6 w-6 text-primary-foreground" />
          </div>
          <DialogTitle className="text-center text-2xl font-black tracking-tight text-secondary">
            Verify your email
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            We sent a 6-digit PIN to {" "}
            <span className="font-semibold text-secondary">{email}</span>. Enter it below to
            activate your account.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-4">
          <div className="flex justify-center gap-2">
            {pin.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                inputsRef.current[index] = el;
                }}                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                disabled={isVerifying}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={cn(
                  "h-12 w-12 rounded-lg border-2 text-center text-xl font-bold tracking-widest text-secondary outline-none transition-all",
                  "focus:border-primary focus:ring-2 focus:ring-primary/30",
                  digit
                    ? "border-primary bg-primary/10"
                    : "border-border/60 bg-background/80",
                  error && "border-red-500 focus:border-red-500 focus:ring-red-300"
                )}
              />
            ))}
          </div>

          {error && (
            <p className="text-center text-sm font-medium text-red-500">{error}</p>
          )}

          <Button
            onClick={() => filled && submit(pin.join(""))}
            disabled={!filled || isVerifying}
            className="w-full h-12 bg-gradient-hero hover:opacity-90 text-primary-foreground font-bold text-base shadow-glow disabled:opacity-60"
          >
            {isVerifying ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" /> Verifying...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> Verify Email
              </span>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Didn&apos;t receive it?{" "}

            {resendCooldown > 0 ? (
              <span className="font-semibold text-muted-foreground">
                Resend available in {formatCooldown(resendCooldown)}
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isVerifying}
                className="font-semibold text-primary hover:underline disabled:opacity-50"
              >
              {isResending ? "Sending..." : "Resend PIN"}
              </button>
            )}
          </p>
        </div>

        <DialogFooter className="sm:justify-center">
          <p className="text-xs text-center text-muted-foreground/70 w-full">
            Make sure to check your spam folder if you don&apos;t see the email.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default PinVerifyModal;
