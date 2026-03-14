import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { ApiError } from "../lib/api-error.js";
import { prisma } from "../lib/prisma";
import { clearCookies } from "./is-auth.middleware.js";
var jwt = require("jsonwebtoken");

dotenv.config();
const isSeller = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies?.access_token ||
      req.header("Authorization")?.replace("Bearer ", "");

    const refresh_token =
      req.cookies?.refresh_token || req.header("x-refresh-token");

    if (!token) {
      throw new ApiError(401, "Unauthorized user request");
    }

    if (!refresh_token) {
      throw new ApiError(
        403,
        "refresh Token is not available in cookies or request header",
      );
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);

    const user: any = decodedToken;

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    const existSeller = await prisma.user.findUnique({
      where: { id: user.user_id, role: "SELLER" },
      include: { sessions: true },
    });

    if (!existSeller) {
      return clearCookies(res, "Seller not found");
    }

    const existSession = existSeller.sessions.find(
      (session: any) => session.refresh_token === refresh_token,
    );

    if (!existSession) {
      return clearCookies(res, "Session not found");
    }

    req.user = user;
    next();
  } catch (error: any) {
    next(new ApiError(401, error?.message || "Invalid access token"));
  }
};

export default isSeller;
