import { Router } from "express";
import { getAttendance, markAttendance } from "../controllers/attendanceController.js";
import { authorizePermissions, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);

router
  .route("/")
  .get(authorizePermissions("attendance:read"), getAttendance)
  .post(authorizePermissions("attendance:write"), markAttendance);

export default router;
