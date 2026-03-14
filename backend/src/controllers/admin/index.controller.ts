import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../lib/api-error";
import { asyncHandler } from "../../lib/async-handler";
import { ApiResponse } from "../../lib/api-response";
import { encryptPayload } from "../../lib/encrypt-payload";
import { OrderStatus } from "../../generated/prisma/enums";
var bcrypt = require("bcryptjs");

const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const { status = "all" } = req.query;
  let whereClause: any = {
    is_deleted: false,
  };
  if (status !== "all") {
    if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
      throw new ApiError(400, "Invalid status");
    }
    whereClause.status = status as OrderStatus;
  }
  const orders = await prisma.order.findMany({
    where: whereClause,
    include: {
      buyer: {
        select: {
          name: true,
          email: true,
        },
      },
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
        encryptPayload(orders),
        "Orders fetched successfully",
      ),
    );
});

const getOrderDetails = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params as { orderId: string };
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
      is_deleted: false,
    },
    include: { product: true, buyer: true },
  });
  if (!order) {
    throw new ApiError(404, "Order not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, encryptPayload(order), "Order fetched successfully"),
    );
});

const changeStatus = asyncHandler(async (req: Request, res: Response) => {
  const orderId = req.params.orderId as string;
  const { status } = req.body;

  if (!status) {
    throw new ApiError(400, "Status is required");
  }

  if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
    throw new ApiError(400, "Invalid status");
  }

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
      is_deleted: false,
    },
  });
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
    PENDING: [OrderStatus.APPROVED, OrderStatus.REJECTED],
    APPROVED: [OrderStatus.COMPLETED],
    REJECTED: [],
    COMPLETED: [],
  };

  const currentStatus = order.status as OrderStatus;

  if (!allowedTransitions[currentStatus].includes(status)) {
    throw new ApiError(
      400,
      `Cannot change order status from ${currentStatus} to ${status}`,
    );
  }

  await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status,
    },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Order status updated successfully"));
});

const addSeller = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (existingUser) {
    throw new ApiError(400, "Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const buyer = await prisma.user.create({
    data: {
      email,
      is_email_verified: true,
      password: hashedPassword,
      name,
      role: "SELLER",
    },
  });

  const payload = encryptPayload({
    name: buyer.name,
    email: buyer.email,
    role: buyer.role,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, payload, "Seller created successfully"));
});

const addAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (existingUser) {
    throw new ApiError(400, "Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = await prisma.user.create({
    data: {
      email,
      is_email_verified: true,
      password: hashedPassword,
      name,
      role: "ADMIN",
    },
  });

  const payload = encryptPayload({
    name: admin.name,
    email: admin.email,
    role: admin.role,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, payload, "Seller created successfully"));
});

const getDashboardData = asyncHandler(async (req: Request, res: Response) => {
  const totalOrders = await prisma.order.count({
    where: {
      is_deleted: false,
    },
  });
  const totalSellers = await prisma.user.count({
    where: {
      role: "SELLER",
      is_deleted: false,
    },
  });
  const totalBuyers = await prisma.user.count({
    where: {
      role: "BUYER",
      is_deleted: false,
    },
  });
  const totalProducts = await prisma.product.count({
    where: {
      is_deleted: false,
    },
  });

  const payload = encryptPayload({
    totalOrders,
    totalSellers,
    totalBuyers,
    totalProducts,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, payload, "Dashboard data fetched successfully"));
});

const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    where: {
      is_deleted: false,
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

const getSellers = asyncHandler(async (req: Request, res: Response) => {
  const sellers = await prisma.user.findMany({
    where: {
      role: "SELLER",
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        encryptPayload(sellers),
        "Sellers fetched successfully",
      ),
    );
});

const getBuyers = asyncHandler(async (req: Request, res: Response) => {
  const buyers = await prisma.user.findMany({
    where: {
      role: "BUYER",
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        encryptPayload(buyers),
        "Buyers fetched successfully",
      ),
    );
});

const getAdmins = asyncHandler(async (req: Request, res: Response) => {
  const admins = await prisma.user.findMany({
    where: {
      role: "ADMIN",
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        encryptPayload(admins),
        "Admins fetched successfully",
      ),
    );
});

export {
  getOrders,
  getOrderDetails,
  changeStatus,
  addSeller,
  addAdmin,
  getDashboardData,
  getProducts,
  getBuyers,
  getAdmins,
  getSellers,
};
