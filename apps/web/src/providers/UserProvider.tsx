"use client";

import { createContext, useContext, ReactNode, useState } from "react";
import { GardenObject } from "@/lib/types";

interface UserContextType {
  userId?: string;
  username?: string;
  gardenObjects: GardenObject[];
  setGardenObjects: (objects: GardenObject[]) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

interface UserProviderProps {
  userId?: string;
  username?: string;
  initialGardenObjects: GardenObject[];
  children: ReactNode;
}

export function UserProvider({
  userId,
  username,
  initialGardenObjects,
  children,
}: UserProviderProps) {
  const [gardenObjects, setGardenObjects] = 
    useState<GardenObject[]>(initialGardenObjects || []);

  const value = {
    userId,
    username,
    gardenObjects,
    setGardenObjects,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}
