"use client";

import { createContext, useContext } from "react";

type UserRole = "admin" | "staff";

const RoleContext = createContext<UserRole>("staff");

export function RoleProvider({ role, children }: { role: UserRole; children: React.ReactNode }) {
  return <RoleContext.Provider value={role}>{children}</RoleContext.Provider>;
}

export function useRole() {
  return useContext(RoleContext);
}