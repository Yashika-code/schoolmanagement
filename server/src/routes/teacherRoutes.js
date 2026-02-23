import { Router } from "express";
import {
  createTeacher,
  deleteTeacher,
  getTeacherById,
  getTeachers,
  updateTeacher,
} from "../controllers/teacherController.js";
import { authorizePermissions, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);

router
  .route("/")
  .get(authorizePermissions("teachers:read"), getTeachers)
  .post(authorizePermissions("teachers:write"), createTeacher);

router
  .route("/:id")
  .get(authorizePermissions("teachers:read"), getTeacherById)
  .put(authorizePermissions("teachers:write"), updateTeacher)
  .delete(authorizePermissions("teachers:write"), deleteTeacher);

export default router;
