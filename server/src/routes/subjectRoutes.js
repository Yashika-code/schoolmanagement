import { Router } from "express";
import {
  createSubject,
  deleteSubject,
  getSubjectById,
  getSubjects,
  updateSubject,
} from "../controllers/subjectController.js";
import { authorizePermissions, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);

router
  .route("/")
  .get(authorizePermissions("subjects:read"), getSubjects)
  .post(authorizePermissions("subjects:write"), createSubject);

router
  .route("/:id")
  .get(authorizePermissions("subjects:read"), getSubjectById)
  .put(authorizePermissions("subjects:write"), updateSubject)
  .delete(authorizePermissions("subjects:write"), deleteSubject);

export default router;
