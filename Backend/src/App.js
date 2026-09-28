import express from "express";
import AuthRouter from "./Routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import productRoutes from "./Routes/Product.routes.js";
const app = express();


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://fullstack-project-e-commerce-frontend.onrender.com",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", AuthRouter);
app.use("/api/products", productRoutes);

export default app;
