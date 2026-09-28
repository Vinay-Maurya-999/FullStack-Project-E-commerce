import { useState } from "react";
import { Zap, LogOut, Menu, X, ShoppingCart, Store } from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { useAppContext } from "../Context/AuthContextValue";
import useApi from "../config/api";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const api = useApi();

  const { user, setUser, setAccessToken } = useAppContext();

  // =========================
  // USER DATA
  // =========================

  const currentUser = user || {};

  const fullName = currentUser.fullName || currentUser.name || "";

  const role = currentUser.role || "user";

  const firstName = fullName.trim().split(" ")[0] || "User";

  const initial = firstName.charAt(0).toUpperCase() || "U";

  // =========================
  // CHECK SELLER
  // =========================

  const isSeller = role.toLowerCase() === "seller";

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = async () => {
    try {
      await api.post(
        "/auth/logout",
        {},
        {
          withCredentials: true,
        },
      );
    } catch (error) {
      console.log("Logout error:", error.response?.data || error);
    } finally {
      setUser(null);
      setAccessToken(null);
      setIsOpen(false);

      navigate("/");
    }
  };

  // =========================
  // NAVIGATION
  // =========================

  const handleNavigation = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  // =========================
  // NAVLINK STYLE
  // =========================

  const desktopLink = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive
        ? "text-lime-500"
        : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
    }`;

  const mobileLink = ({ isActive }) =>
    `rounded-lg px-3 py-3 text-sm font-medium ${
      isActive
        ? "bg-lime-100 text-lime-700 dark:bg-lime-950/40 dark:text-lime-400"
        : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90">
      {/* =====================================================
          NAVBAR CONTAINER
      ====================================================== */}

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* =====================================================
            LOGO
        ====================================================== */}

        <div
          onClick={() => handleNavigation("/shop")}
          className="flex cursor-pointer items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-400 text-zinc-950">
            <Zap size={20} fill="currentColor" />
          </div>

          <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Shop
            <span className="text-lime-500">M</span>
          </span>
        </div>

        {/* =====================================================
            DESKTOP NAVIGATION
        ====================================================== */}

        <div className="hidden items-center gap-8 md:flex">
          {/* Products */}

          <NavLink to="/shop" end className={desktopLink}>
            Products
          </NavLink>

          {/* Seller */}

          {isSeller && (
            <NavLink to="/shop/seller" className={desktopLink}>
              <span className="flex items-center gap-2">
                <Store size={17} />
                Seller
              </span>
            </NavLink>
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {/* User Profile */}

          <div className="flex items-center gap-2 rounded-full border border-zinc-300 bg-zinc-100 py-1 pl-1 pr-4 dark:border-zinc-700 dark:bg-zinc-900">
            {/* Initial */}

            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lime-400 text-xs font-bold text-zinc-950">
              {initial}
            </span>

            {/* Name + Role */}

            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                {firstName}
              </span>

              <span className="text-[11px] capitalize text-zinc-500 dark:text-zinc-400">
                {role}
              </span>
            </div>
          </div>

          {/* Logout */}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-red-950/30 dark:hover:text-red-400"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900 md:hidden"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950 md:hidden">
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-100 p-3 dark:border-zinc-800 dark:bg-zinc-900">
            {/* Initial */}

            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-400 font-bold text-zinc-950">
              {initial}
            </span>

            {/* Name + Role */}

            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                {firstName}
              </span>

              <span className="text-xs capitalize text-zinc-500 dark:text-zinc-400">{role}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            {/* Products */}

            <NavLink to="/shop" end onClick={() => setIsOpen(false)} className={mobileLink}>
              Products
            </NavLink>

            {isSeller && (
              <NavLink to="/shop/seller" onClick={() => setIsOpen(false)} className={mobileLink}>
                <span className="flex items-center gap-2">
                  <Store size={18} />
                  Seller Dashboard
                </span>
              </NavLink>
            )}

            {/* Logout */}

            <button
              onClick={handleLogout}
              className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
