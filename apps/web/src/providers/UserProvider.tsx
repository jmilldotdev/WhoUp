"use client";

import { createContext, useContext, ReactNode, useState } from "react";
import { GardenObject } from "@/actions/gardenObjects";

interface UserContextType {
  userId?: string;
  username?: string;
  gardenObjects: GardenObject[];
  setGardenObjects: (objects: GardenObject[]) => void;
}

const UserContext = createContext<UserContextType | null>(null);

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
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
    useState<GardenObject[]>(initialGardenObjects);

  return (
    <UserContext.Provider 
      value={{ 
        userId, 
        username, 
        gardenObjects,
        setGardenObjects
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
