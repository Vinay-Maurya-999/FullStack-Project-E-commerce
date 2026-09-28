import AuthProvider from "./Context/AuthContext.jsx";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRouter from "./routes/AppRoutes";
import { ShopProvider } from "./Context/ShopConetext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <ShopProvider>
      <AppRouter />
    </ShopProvider>
  </AuthProvider>,
);
