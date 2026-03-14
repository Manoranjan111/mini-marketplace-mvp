let CryptoJS = require("crypto-js");

const ENCRYPTION_KEY = process.env.PAYLOAD_ENCRYPTION_KEY;

export const encryptPayload = (payload: any) => {
  if (!payload || typeof payload !== "object") {
    throw new Error("Payload must be a non-null object.");
  }
  try {
    const jsonString = JSON.stringify(payload);
    return CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error("Encryption failed:", error);
    throw new Error("Failed to encrypt the payload.");
  }
};

export const decryptPayload = (encryptedString: string) => {
  if (typeof encryptedString !== "string" || !encryptedString) {
    throw new Error("Encrypted string must be a non-empty string.");
  }
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedString, ENCRYPTION_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Failed to decrypt and parse the payload.");
  }
};
