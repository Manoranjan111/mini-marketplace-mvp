import { Request, Response, NextFunction } from "express";
import { ApiError } from "../lib/api-error";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Check if the error is an instance of ApiError
  console.error(err);
  console.log("Error type:", err.constructor.name);
  if (err instanceof ApiError || err.name === "ApiError") {
    const { statusCode, message, success = false, errors = [] } = err;
    return res.status(statusCode!).json({
      success,
      error: message,
      errors,
    });
  }

  // For any other errors that are not instances of ApiError
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
};

export { errorHandler };
