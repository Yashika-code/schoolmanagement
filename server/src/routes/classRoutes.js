import { Router } from "express";
import {
  createClass,
  deleteClass,
  getClassById,
  getClasses,
  updateClass,
} from "../controllers/classController.js";
import { authorizePermissions, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);

router
  .route("/")
  .get(authorizePermissions("classes:read"), getClasses)
  .post(authorizePermissions("classes:write"), createClass);

router
  .route("/:id")
  .get(authorizePermissions("classes:read"), getClassById)
  .put(authorizePermissions("classes:write"), updateClass)
  .delete(authorizePermissions("classes:write"), deleteClass);

export default router;
