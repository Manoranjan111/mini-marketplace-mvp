import fs from "fs";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { ApiError } from "./api-error";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (
  file_path: string,
): Promise<{ secure_url: string; public_id: string }> => {
  let res: UploadApiResponse | null = null;

  try {
    res = await cloudinary.uploader.upload(file_path, {
      folder: "task_manager",
    });
    if (!res?.secure_url && fs.existsSync(file_path)) {
      console.warn("Retrying Cloudinary upload...");
      res = await cloudinary.uploader.upload(file_path, {
        folder: "task_manager",
      });
    }

    if (!res?.secure_url) {
      throw new ApiError(500, "Image upload failed after retry");
    }
    return {
      secure_url: res.secure_url,
      public_id: res.public_id,
    };
  } catch (error: any) {
    console.error("Cloudinary Upload Error:", error);
    throw new ApiError(
      error?.http_code || 500,
      error?.message || "Cloudinary upload error",
    );
  } finally {
    if (fs.existsSync(file_path)) {
      try {
        fs.unlinkSync(file_path);
      } catch (err) {
        console.error("Failed to delete temp file:", err);
      }
    }
  }
};

export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok") {
      throw new ApiError(500, "Failed to delete image from Cloudinary");
    }
  } catch (error: any) {
    console.error("Cloudinary Delete Error:", error);
    throw new ApiError(
      error?.http_code || 500,
      error?.message || "Cloudinary delete error",
    );
  }
};
