import axios from "axios";
import { useEffect, useMemo } from "react";
import { useAppContext } from "../Context/AuthContextValue";
import { useShopContext } from "../Context/ShopContextValue";
export default function useApi() {
  const { accessToken, setAccessToken, setUser } = useAppContext();

  const api = useMemo(
    () =>
      axios.create({
        baseURL: https://fullstack-project-e-commerce-backend-hlhi.onrender.com/ || "/api",
        withCredentials: true,
      }),
    [],
  );

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use((config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    });

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const request = error.config;
        const canRefresh =
          error.response?.status === 401 &&
          request &&
          !request._retry &&
          request.headers?.Authorization &&
          !request.url?.includes("/auth/refresh-token");

        if (!canRefresh) return Promise.reject(error);

        request._retry = true;
        try {
          const response = await api.post("/auth/refresh-token");
          const { AccessToken, user } = response.data.data;

          setAccessToken(AccessToken);
          setUser(user);
          request.headers.Authorization = `Bearer ${AccessToken}`;
          return api(request);
        } catch (refreshError) {
          setAccessToken(null);
          setUser(null);
          return Promise.reject(refreshError);
        }
      },
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, api, setAccessToken, setUser]);

  return api;
}
