import jwt from "jsonwebtoken";
import { getJwtSecret } from "./jwtSecret.js";

export const generateToken = (user) => {
  const jwtSecret = getJwtSecret();

  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    jwtSecret,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};
