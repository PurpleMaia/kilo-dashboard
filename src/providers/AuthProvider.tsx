"use client";

import { User } from "@/lib/auth/utils";
import * as React from "react";

const AuthContext = React.createContext<User | null>(null);

export function AuthProvider({ value, children }: { value: User | null; children: React.ReactNode }) {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function getUserDataFromClient() {
  return React.useContext(AuthContext);
}