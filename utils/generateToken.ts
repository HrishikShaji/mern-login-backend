import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const createSecretToken = (id: string) => {
  const secret = process.env.SECRET || "";
  return jwt.sign({ id }, secret, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};
