import { createContext, useContext } from "react";

export const AuthContext = createContext(null);

export function useAppContext() {
  const context = useContext(AuthContext);

  
  return context;
}
