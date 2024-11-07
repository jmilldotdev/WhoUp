import React, { createContext, useContext, useState, ReactNode } from "react";
import { Broadcast } from "@/lib/types";

interface BroadcastContextType {
  currentBroadcast: Broadcast | null;
  setCurrentBroadcast: (broadcast: Broadcast | null) => void;
}

const BroadcastContext = createContext<BroadcastContextType | undefined>(undefined);

export const BroadcastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentBroadcast, setCurrentBroadcast] = useState<Broadcast | null>(null);

  return (
    <BroadcastContext.Provider value={{ currentBroadcast, setCurrentBroadcast }}>
      {children}
    </BroadcastContext.Provider>
  );
};

export const useBroadcast = () => {
  const context = useContext(BroadcastContext);
  if (!context) {
    throw new Error("useBroadcast must be used within a BroadcastProvider");
  }
  return context;
}; 