import { useRef } from "react";

export const usePlayerNavigation = (totalPlayers: number) => {
  const playerRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handlePlayerKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Move to next input if available
      if (index < totalPlayers - 1) {
        playerRefs.current[index + 1]?.focus();
      }
    }
  };

  return {
    playerRefs,
    handlePlayerKeyDown,
  };
};
