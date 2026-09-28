import { useState } from "react";
import { ShopContext } from "./ShopContextValue";

export function ShopProvider({ children }) {
  const [product, setProduct] = useState([]);

  return (
    <ShopContext.Provider
      value={{
        product,
        setProduct,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}
