import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../lib/api-error";
import { asyncHandler } from "../../lib/async-handler";
import { ApiResponse } from "../../lib/api-response";
import { encryptPayload } from "../../lib/encrypt-payload";
import { options, refreshTokenOptions } from "../../lib/utils";
import { generateAccessAndRefreshTokens } from "../auth.controller";
var bcrypt = require("bcryptjs");

const signupBuyer = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const existEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (existEmail) {
    if (!existEmail.is_email_verified) {
      await prisma.user.delete({
        where: {
          id: existEmail.id,
        },
      });
    } else {
      throw new ApiError(400, "Email already exist");
    }
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const savedUser = await prisma.user.create({
    data: {
      ...req.body,
      password: hashedPassword,
      is_email_verified: true, // for temperary use because currentely i am not send any OTP to user and not verify that into UI
    },
  });

  const { access_token, refresh_token } = await generateAccessAndRefreshTokens({
    userId: savedUser.id,
    req,
  });

  const payload = encryptPayload({
    user: {
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
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
    .json(new ApiResponse(200, payload, "Signup & Logged In Successfully"));
});

const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const buyerId = req.user?.user_id as string;
  const orders = await prisma.order.findMany({
    where: {
      buyerId,
      is_deleted: false,
    },
    include: {
      product: true,
    },
  });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        encryptPayload(orders),
        "Orders fetched successfully",
      ),
    );
});

const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const { niche, minPrice, maxPrice, search } = req.query;

  let whereClause: any = {
    is_deleted: false,
    price: {
      gte: minPrice ? Number(minPrice) : 0,
      lte: maxPrice ? Number(maxPrice) : 1000000,
    },
  };

  if (niche && niche !== "All") {
    whereClause.niche = {
      contains: niche as string,
      mode: "insensitive",
    };
  }

  if (search) {
    whereClause.title = {
      contains: search as string,
      mode: "insensitive",
    };
  }

  const products = await prisma.product.findMany({
    where: whereClause,
    select: {
      id: true,
      title: true,
      niche: true,
      price: true,
      metrics: true,
      assets: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        encryptPayload(products),
        "Products fetched successfully",
      ),
    );
});

const placeOrder = asyncHandler(async (req: Request, res: Response) => {
  const buyerId = req.user?.user_id as string;
  const { items } = req.body as {
    items: { productId: string; quantity: number; price: number }[];
  };

  const order = await prisma.order.createMany({
    data: items.map((item) => ({
      buyerId,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    })),
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, encryptPayload(order), "Order placed successfully"),
    );
});

export { signupBuyer, getProducts, getOrders, placeOrder };
