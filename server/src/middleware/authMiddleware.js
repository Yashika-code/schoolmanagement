import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/User.js";
import { roleHasPermission } from "../config/permissions.js";
import { getJwtSecret } from "../utils/jwtSecret.js";

export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Not authorized. Token missing");
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, getJwtSecret());
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      throw new ApiError(401, "User no longer exists");
    }
    next();
  } catch (error) {
    throw new ApiError(401, "Token invalid or expired");
  }
});

export const authorizeRoles = (...roles) => {
  return (req, _res, next) => {
    if (!roles.includes(req.user?.role)) {
      return next(new ApiError(403, "Forbidden for your role"));
    }
    next();
  };
};

export const authorizePermissions = (...permissions) => {
  return (req, _res, next) => {
    const role = req.user?.role;
    const hasPermission = permissions.some((permission) => roleHasPermission(role, permission));
    if (!hasPermission) {
      return next(new ApiError(403, "You do not have permission to perform this action"));
    }
    next();
  };
};
