import { Navigate, Outlet } from "react-router";
import { useAppContext } from "../Context/AuthContextValue";

export default function SellerProtectedRoute() {
  const { user, authLoading } = useAppContext();

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== "seller") {
    return <Navigate to="/shop" replace />;
  }

  return <Outlet />;
}
