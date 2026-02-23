import { ROLES } from "./roles.js";

export const PERMISSIONS = {
  [ROLES.ADMIN]: [
    "students:read",
    "students:write",
    "teachers:read",
    "teachers:write",
    "classes:read",
    "classes:write",
    "subjects:read",
    "subjects:write",
    "attendance:read",
    "attendance:write",
  ],
  [ROLES.TEACHER]: [
    "students:read",
    "teachers:read",
    "classes:read",
    "subjects:read",
    "attendance:read",
    "attendance:write",
  ],
  [ROLES.STUDENT]: [
    "students:read",
    "classes:read",
    "subjects:read",
    "attendance:read",
  ],
};

export const roleHasPermission = (role, permission) => {
  const allowed = PERMISSIONS[role] || [];
  return allowed.includes(permission);
};
