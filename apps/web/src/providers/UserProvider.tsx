"use client";

import { createContext, useContext, ReactNode } from "react";

interface UserContextType {
  userId?: string;
  username?: string;
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
  children: ReactNode;
}

export function UserProvider({
  userId,
  username,
  children,
}: UserProviderProps) {
  return (
    <UserContext.Provider value={{ userId, username }}>
      {children}
    </UserContext.Provider>
  );
}
