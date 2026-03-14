import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import CryptoJS from "crypto-js";

const DECRYPTION_KEY = import.meta.env.VITE_PAYLOAD_ENCRYPTION_KEY;
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const decryptPayload = (encryptedString: string) => {
  if (typeof encryptedString !== "string" || !encryptedString) {
    throw new Error("Encrypted string must be a non-empty string.");
  }
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedString, DECRYPTION_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Failed to decrypt and parse the payload.");
  }
};
