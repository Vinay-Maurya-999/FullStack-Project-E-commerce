import React from "react";
import { Outlet } from "react-router";
import Navbar from "../Page/Navbar";
 import useApi from "../config/api";
import { useAppContext } from "../Context/AuthContextValue";
import { useEffect } from "react";

const mainlayout = () => {
  const api = useApi();
  const { setUser } = useAppContext();
  useEffect(() => {
    const getMe = async () => {
      try {
        const res = await api.get("/api/auth/get-me");

        setUser(res.data.data.user);
      } catch (error) {
        console.log("Get me error:", error.response?.data || error.message);
      }
    };

    getMe();
  }, []);

  return (
    <div>
      <Navbar />
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default mainlayout;
