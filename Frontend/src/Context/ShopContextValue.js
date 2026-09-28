import { createContext, useContext } from "react";

export const ShopContext = createContext(null);

export function useShopContext() {
  const context = useContext(ShopContext);

  if (!context) {
    throw new Error("useShopContext must be used within a ShopProvider");
  }
  return context;
}
