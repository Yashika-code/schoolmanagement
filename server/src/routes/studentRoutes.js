import { Router } from "express";
import {
  createStudent,
  deleteStudent,
  getStudentById,
  getStudents,
  updateStudent,
} from "../controllers/studentController.js";
import { authorizePermissions, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);

router
  .route("/")
  .get(authorizePermissions("students:read"), getStudents)
  .post(authorizePermissions("students:write"), createStudent);

router
  .route("/:id")
  .get(authorizePermissions("students:read"), getStudentById)
  .put(authorizePermissions("students:write"), updateStudent)
  .delete(authorizePermissions("students:write"), deleteStudent);

export default router;
