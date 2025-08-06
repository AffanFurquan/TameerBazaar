import React, { createContext, useContext, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@shared/schema";

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isBuyer: boolean;
  isSeller: boolean;
  isAdmin: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();

  const contextValue: UserContextType = {
    user,
    isLoading,
    isAuthenticated,
    isBuyer: user?.role === "buyer",
    isSeller: user?.role === "seller" || user?.role === "admin",
    isAdmin: user?.role === "admin",
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
