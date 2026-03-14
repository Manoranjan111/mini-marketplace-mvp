import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../lib/api-error";
import { asyncHandler } from "../../lib/async-handler";
import { ApiResponse } from "../../lib/api-response";
import { FormSchemaValidation } from "../../lib/utils";
import { uploadImage } from "../../lib/claudinary";
import { encryptPayload } from "../../lib/encrypt-payload";
import { addListingSchema } from "../../entity/seller/index.entity";
import { OrderStatus } from "../../generated/prisma/enums";

const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const sellerId = req.user?.user_id as string;
  const products = await prisma.product.findMany({
    where: {
      sellerId: sellerId,
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

const getProductDetails = asyncHandler(async (req: Request, res: Response) => {
  const sellerId = req.user?.user_id as string;
  const productId = req.params.productId as string;
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
      is_deleted: false,
      sellerId: sellerId,
    },
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        encryptPayload(product),
        "Product fetched successfully",
      ),
    );
});

const addProduct = asyncHandler(async (req: Request, res: Response) => {
  const sellerId = req.user?.user_id as string;
  const data = await FormSchemaValidation(addListingSchema, req.body);
  const saveProduct = await prisma.product.create({
    data: {
      ...data,
      sellerId: sellerId,
    },
  });

  const listAttachments: any[] = [];

  if (Array.isArray(req.files)) {
    const uploadPromises = req.files.map((file: any) => {
      console.log("Processing file:", file);
      return uploadImage(file.path);
    });

    const results = await Promise.all(uploadPromises);

    results.forEach((result, index) => {
      if (result.secure_url) {
        listAttachments.push({
          productId: saveProduct.id,
          assetUrl: result.secure_url,
          publicId: result.public_id,
          position: index,
        });
      }
    });
  }

  if (listAttachments.length > 0) {
    await prisma.productAssets.createMany({
      data: listAttachments,
    });
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        encryptPayload(saveProduct),
        "Product Listing successfully",
      ),
    );
});

const removeProduct = asyncHandler(async (req: Request, res: Response) => {
  const sellerId = req.user?.user_id as string;
  const productId = req.params.productId as string;
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
      is_deleted: false,
      sellerId: sellerId,
    },
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      is_deleted: true,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Product Listing successfully deleted"));
});

const getDashboardData = asyncHandler(async (req: Request, res: Response) => {
  const sellerId = req.user?.user_id as string;

  const noOfProducts = await prisma.product.count({
    where: {
      sellerId: sellerId,
      is_deleted: false,
    },
  });

  const noOfSales = await prisma.order.count({
    where: {
      is_deleted: false,
      product: {
        sellerId: sellerId,
      },
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        encryptPayload({ noOfProducts, noOfSales }),
        "Dashboard data fetched successfully",
      ),
    );
});

const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const sellerId = req.user?.user_id as string;
  const { status = "all" } = req.query;
  let whereClause: any = {
    is_deleted: false,
    product: {
      sellerId: sellerId,
    },
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
      product: true,
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
  const sellerId = req.user?.user_id as string;
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
      is_deleted: false,
      product: {
        sellerId: sellerId,
      },
    },
    include: {
      buyer: {
        select: {
          name: true,
          email: true,
        },
      },
      product: true,
    },
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

export {
  getProducts,
  getProductDetails,
  addProduct,
  removeProduct,
  getDashboardData,
  getOrders,
  getOrderDetails,
};
