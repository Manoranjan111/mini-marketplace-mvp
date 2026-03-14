import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { ApiError } from "../lib/api-error.js";
import { prisma } from "../lib/prisma";
import { LogoutCookiesOptions } from "../lib/utils.js";
import { ApiResponse } from "../lib/api-response.js";
var jwt = require("jsonwebtoken");

dotenv.config();
const isAuthorized = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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

    const existUser = await prisma.user.findUnique({
      where: { id: user.user_id },
      include: { sessions: true },
    });

    if (!existUser) {
      return clearCookies(res, "User not Found");
    }

    const existSession = existUser.sessions.find(
      (session: any) => session.refresh_token === refresh_token,
    );

    if (!existSession) {
      // return res
      //   .status(200)
      //   .clearCookie("access_token", LogoutCookiesOptions)
      //   .clearCookie("refresh_token", LogoutCookiesOptions)
      //   .json(new ApiResponse(200, {}, "Session not found"));
      return clearCookies(res, "Session not found");
    }

    req.user = user;
    next();
  } catch (error: any) {
    next(new ApiError(401, error?.message || "Invalid access token"));
  }
};

export default isAuthorized;

export const clearCookies = (res: Response, message: string) => {
  return res
    .status(200)
    .clearCookie("access_token", LogoutCookiesOptions)
    .clearCookie("refresh_token", LogoutCookiesOptions)
    .json(new ApiResponse(200, {}, message));
};
