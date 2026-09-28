import { createBrowserRouter, RouterProvider } from "react-router";
import RegisterPage from "../Page/Register";
import LoginForm from "../Page/Login";
import ProductList from "../Page/Product";
import Authlayout from "../layouts/Auth.layouts";
import Mainlayout from "../layouts/MainLayout";
import Seller from "../Page/Seller";
import ProductDetail from "../Page/Details";
import SellerProtectedRoute from "./ProtectedRoutes";
import ProtectedRoute from "./userProcted";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Authlayout />,
    children: [
      {
        index: true,
        element: <LoginForm />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: "/shop",
    element: <ProtectedRoute />,
    children: [
      {
        element: <Mainlayout />,
        children: [
          {
            index: true,
            element: <ProductList />,
          },
          {
            path: "seller",
            element: <SellerProtectedRoute />,
            children: [
              {
                index: true,
                element: <Seller />,
              },
            ],
          },
          {
            path: "products/:id",
            element: <ProductDetail />,
          },
        ],
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
