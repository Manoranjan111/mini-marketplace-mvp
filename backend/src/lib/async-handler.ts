import { Request, Response, NextFunction } from "express";
import { prisma } from "./prisma";

type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<any> | void;

const asyncHandler = (
  requestHandler: RequestHandler,
): ((req: Request, res: Response, next: NextFunction) => void) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await requestHandler(req, res, next);
    } catch (err: any) {
      // Check if the error is a Prisma error
      if (
        err instanceof Error &&
        err.name === "PrismaClientKnownRequestError"
      ) {
        const prismaError = err as PrismaError;
        const { code, meta } = prismaError;
        // Handle specific Prisma errors
        switch (code) {
          case "P2002":
            // Unique constraint violation
            res
              .status(400)
              .json({ error: `Duplicate ${meta?.target}`, details: meta });
            break;
          case "P2025":
            res.status(400).json({
              error: `Not Found Error ${meta?.target}`,
              details: meta,
            });
            break;
          default:
            // Other Prisma errors
            res
              .status(500)
              .json({ error: `Database error ${meta?.target}`, details: meta });
        }
      } else {
        next(err);
      }
    } finally {
      await prisma.$disconnect();
    }
  };
};

export { asyncHandler };

interface PrismaError extends Error {
  code: string;
  meta: any;
}
