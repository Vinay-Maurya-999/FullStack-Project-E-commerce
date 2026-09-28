import axios from "axios";
import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContextValue";

const baseApi = axios.create({
  baseURL: "https://fullstack-project-e-commerce-backend-hlhi.onrender.com",
  withCredentials: true,
});

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let active = true;

    baseApi
      .post(`/api/auth/refresh-token`, {}, { withCredentials: true })
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
