import { z } from "zod";
import { CookieOptions } from "express";
import { ApiError } from "./api-error";

export async function FormSchemaValidation(
  schema: z.ZodSchema<any>,
  data: any,
) {
  const body = JSON.parse(JSON.stringify(data));

  const result = schema.safeParse(body);

  if (!result.success) {
    const error = result.error.issues[0];

    const field = error.path.join(".");
    console.log(`${field} - ${error.message}`);

    throw new ApiError(400, `${field} - ${error.message}`);
  }

  return result.data;
}

export const options: CookieOptions = {
  httpOnly: false,
  secure: true,
  sameSite: "strict",
  domain: process.env.DOMAIN,
  maxAge: 24 * 60 * 60 * 1000,
  path: "/",
};

export const refreshTokenOptions: CookieOptions = {
  ...options,
  maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
};

export const LogoutCookiesOptions: CookieOptions = {
  httpOnly: false,
  secure: true,
  sameSite: "strict",
  domain: process.env.DOMAIN,
  expires: new Date(0), // Set to January 1, 1970 00:00:00 UTC
};
