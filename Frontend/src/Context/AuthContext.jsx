import axios from "axios";
import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContextValue";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const apiBase = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

    axios
      .post(`${apiBase}/auth/refresh-token`, {}, { withCredentials: true })
      .then((response) => {
        if (!active) return;
        setAccessToken(response.data.data.AccessToken);
        setUser(response.data.data.user);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setAuthLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, accessToken, setAccessToken, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
