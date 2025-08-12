// client-side state management for user data (sort of like a session)
'use client'

import { useState, createContext, useContext } from "react";
import { User, Aina } from "@/lib/auth/utils";

interface AuthContextType {
  user: User | null;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;  
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// initUser is retrieved once on server (app/layout.tsx)
export const AuthProvider = ({ children, initUser }: { children: React.ReactNode, initUser: User | null }) => {
  const [user, setUser] = useState<User | null>(initUser);

  // state setting 
  const login = async (userData: User) => {    
    setUser(userData);
  };

  const logout = async () => {    
    setUser(null);
  };

  return (
      <AuthContext.Provider value={{ user, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};