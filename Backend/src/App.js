import express from "express";
import AuthRouter from "./Routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import productRoutes from "./Routes/Product.routes.js";
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://fullstack-project-e-commerce-frontend.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", AuthRouter);
app.use("/api/products", productRoutes);

export default app;
