"use client";

import { createContext, useContext, ReactNode, useState, useCallback } from "react";
import { GardenObject } from "@/lib/types";
import { getUserGardenObjects } from "@/actions/gardenObjects";

interface UserContextType {
  userId?: string;
  username?: string;
  gardenObjects: GardenObject[];
  setGardenObjects: (objects: GardenObject[]) => void;
  refreshGardenObjects: () => Promise<void>;
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

  const refreshGardenObjects = useCallback(async () => {
    if (userId) {
      const objects = await getUserGardenObjects(userId);
      setGardenObjects(objects);
    }
  }, [userId]);

  const value = {
    userId,
    username,
    gardenObjects,
    setGardenObjects,
    refreshGardenObjects,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}
