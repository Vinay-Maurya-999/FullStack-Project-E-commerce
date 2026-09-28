import express from "express";
import AuthRouter from "./Routes/auth.routes.js";
import cookieParser from "cookie-parser";
import productRoutes from "./Routes/Product.routes.js";
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", AuthRouter);
app.use("/api/products", productRoutes);

export default app;
