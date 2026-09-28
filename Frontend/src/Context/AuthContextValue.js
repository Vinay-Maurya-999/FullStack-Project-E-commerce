import { createContext, useContext } from "react";

export const AuthContext = createContext(null);

export function useAppContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAppContext must be used within an AuthProvider");
  }
  return context;
}
