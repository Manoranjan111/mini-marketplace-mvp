import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { ApiError } from "../lib/api-error";
import { asyncHandler } from "../lib/async-handler";
import { ApiResponse } from "../lib/api-response";
import { encryptPayload } from "../lib/encrypt-payload";
import {
  LogoutCookiesOptions,
  options,
  refreshTokenOptions,
} from "../lib/utils";
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

export const generateAccessAndRefreshTokens = async ({
  userId,
  req,
}: {
  userId: string;
  req: any;
}) => {
  // THIS FUNCTION WILL RETURN ACCESSTOKEN, REFRESHTOKEN AND SAVE REFRESHTOKEN INTO DATABASE
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
        is_deleted: false,
      },
    });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const access_token = jwt.sign(
      {
        user_id: user?.id,
        role: user?.role,
      },
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY!,
      },
    );
    const refresh_token = jwt.sign(
      {
        user_id: user?.id,
      },
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY!,
      },
    );

    const userAgent = req.headers["user-agent"];
    const ipAddress =
      req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
      req.socket?.remoteAddress ||
      req.ip;
    const incommingRefreshToken =
      req.cookies?.refreshToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    await prisma.session.upsert({
      where: {
        userId_refresh_token: {
          userId,
          refresh_token: incommingRefreshToken ?? "",
        },
      },
      update: {
        refresh_token,
        userAgent,
        ipAddress,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
      create: {
        userId,
        refresh_token,
        userAgent,
        ipAddress,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
    });

    return { access_token, refresh_token };
  } catch (error: any) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token",
    );
  }
};

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, role } = req.body;
  const existUser = await prisma.user.findUnique({
    where: { email, role, is_deleted: false },
  });

  if (!existUser) {
    throw new ApiError(404, "User not Exist");
  }

  if (!existUser.is_email_verified) {
    throw new ApiError(403, "Email not verified");
  }

  if (!existUser.is_active) {
    throw new ApiError(403, "User is Deactivated");
  }

  if (existUser.is_blocked) {
    throw new ApiError(403, "You are blocked contact our admin");
  }

  const verifyPassword = await bcrypt.compareSync(password, existUser.password);

  if (!verifyPassword) {
    throw new ApiError(400, "Invalid Credential");
  }

  const { access_token, refresh_token } = await generateAccessAndRefreshTokens({
    userId: existUser.id,
    req,
  });

  const payload = encryptPayload({
    user: {
      id: existUser.id,
      name: existUser.name,
      email: existUser.email,
      role: existUser.role,
    },
    access_token,
    refresh_token,
  });
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");

  return res
    .status(200)
    .cookie("access_token", access_token, options)
    .cookie("refresh_token", refresh_token, refreshTokenOptions)
    .json(new ApiResponse(200, payload, "Logged In Successfully"));
});

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const user_id = req.user.user_id;
  const refresh_token =
    req.cookies.refresh_token || req.header("x-refresh-token");

  await prisma.session.update({
    where: {
      userId_refresh_token: {
        userId: user_id,
        refresh_token,
      },
    },
    data: {
      is_deleted: true,
    },
  });

  return res
    .status(200)
    .clearCookie("access_token", LogoutCookiesOptions)
    .clearCookie("refresh_token", LogoutCookiesOptions)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const incomingRefreshToken =
    req.cookies?.refresh_token ||
    req.header("Authorization")?.replace("Bearer ", "");

  // console.log(incomingRefreshToken);

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }
  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET,
  );

  const user = await prisma.user.findUnique({
    where: {
      id: decodedToken?.user_id,
      is_deleted: false,
    },
    include: {
      sessions: true,
    },
  });

  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  if (!user.is_active) {
    throw new ApiError(403, "User is Deactivated");
  }

  if (user.is_blocked) {
    throw new ApiError(403, "You are blocked contact our admin");
  }

  const existRefreshtoken = user.sessions.find(
    (session) => session.refresh_token === incomingRefreshToken,
  );

  if (!existRefreshtoken) {
    return res
      .status(200)
      .clearCookie("accessToken", LogoutCookiesOptions)
      .clearCookie("refreshToken", LogoutCookiesOptions)
      .json(new ApiResponse(200, {}, "Session not found"));
  }

  const { access_token, refresh_token } = await generateAccessAndRefreshTokens({
    userId: user.id,
    req,
  });

  res.clearCookie("access_token");
  res.clearCookie("refresh_token");

  const payload = encryptPayload({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    access_token,
    refresh_token,
  });

  return res
    .status(200)
    .cookie("access_token", access_token, options)
    .cookie("refresh_token", refresh_token, refreshTokenOptions)
    .json(new ApiResponse(200, payload, "user Logged In Successfully"));
});

const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  const user_id = req.user?.user_id;
  const loggedInUser = await prisma.user.findUnique({
    where: { id: user_id },
    select: {
      id: true,
      name: true,
      email: true,
      sessions: {
        where: {
          is_deleted: false,
        },
      },
    },
  });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        encryptPayload(loggedInUser),
        "User fetched Successfully",
      ),
    );
});

const removeSession = asyncHandler(async (req: Request, res: Response) => {
  const sessionId = req.params.sessionId as string;
  const userId = req.user?.user_id;

  const session = await prisma.session.findFirst({
    where: {
      sessionId: sessionId,
      userId: userId,
    },
  });

  if (!session) {
    throw new ApiError(404, "Session not found");
  }

  await prisma.session.update({
    where: {
      sessionId: sessionId,
      userId: userId,
    },
    data: {
      is_deleted: true,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Session removed successfully"));
});

const removeAllSessions = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.user_id;

  await prisma.session.updateMany({
    where: {
      userId: userId,
      is_deleted: false,
    },
    data: {
      is_deleted: true,
    },
  });

  return res
    .status(200)
    .clearCookie("access_token", LogoutCookiesOptions)
    .clearCookie("refresh_token", LogoutCookiesOptions)
    .json(new ApiResponse(200, null, "All sessions removed successfully"));
});

export {
  loginUser,
  logoutUser,
  refreshToken,
  getCurrentUser,
  removeSession,
  removeAllSessions,
};
