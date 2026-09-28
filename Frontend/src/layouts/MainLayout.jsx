import React from "react";
import { Outlet } from "react-router";
import Navbar from "../Page/Navbar";

const mainlayout = () => {
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
