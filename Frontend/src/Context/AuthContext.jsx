import axios from "axios";
import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContextValue";
import useApi from "../config/api";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
const api = useApi();
  useEffect(() => {
    let active = true;
  

    axios
      .post(`${api}/auth/refresh-token`, {}, { withCredentials: true })
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
