import express from "express";
import { Request, Response } from "express";
import { rateLimit } from "express-rate-limit";
import dotenv from "dotenv";
import cors from "cors";
import { errorHandler } from "./middlewares/error.handler";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { ApiError } from "./lib/api-error";
import requestIp from "request-ip";

import adminRoutes from "./routes/admin/index.routes";
import buyerRoutes from "./routes/buyer/index.routes";
import sellerRoutes from "./routes/seller/index.routes";
import authRoutes from "./routes/auth.routes";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ALLOWED_ORIGINS?.split(","),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);

app.use(requestIp.mw());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request, res: Response) => {
    return req.clientIp || "";
  },

  handler: (_, __, ___, options) => {
    throw new ApiError(
      options.statusCode || 500,
      `There are too many requests. You are only allowed ${
        options.max
      } requests per ${options.windowMs / 60000} minutes`,
    );
  },
});

app.use(limiter);
app.use(bodyParser.json({ limit: "1mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

app.get("/api/v1", (req: Request, res: Response) => {
  res.send("Hello from Server!");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/buyer", buyerRoutes);
app.use("/api/v1/seller", sellerRoutes);
app.use("/api/v1/admin", adminRoutes);

app.use(errorHandler);
app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
