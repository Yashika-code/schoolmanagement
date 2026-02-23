import Teacher from "../models/Teacher.js";
import User from "../models/User.js";
import ClassModel from "../models/ClassModel.js";
import Subject from "../models/Subject.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ROLES } from "../config/roles.js";

export const getTeachers = asyncHandler(async (req, res) => {
  const query = {};
  if (req.user.role === ROLES.TEACHER) {
    query.user = req.user._id;
  }
  const teachers = await Teacher.find(query)
    .populate("user", "name email role")
    .populate("subjects", "name code")
    .populate("classes", "name");
  res.json({ success: true, data: teachers });
});

export const getTeacherById = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id)
    .populate("user", "name email role")
    .populate("subjects", "name code")
    .populate("classes", "name");
  if (!teacher) throw new ApiError(404, "Teacher not found");
  if (req.user.role === ROLES.TEACHER && String(teacher.user._id || teacher.user) !== String(req.user._id)) {
    throw new ApiError(403, "You can only view your own record");
  }
  res.json({ success: true, data: teacher });
});

export const createTeacher = asyncHandler(async (req, res) => {
  const { name, email, password, employeeId, classIds, subjectIds, ...rest } = req.body;
  if (!name || !email || !password || !employeeId) {
    throw new ApiError(400, "Missing required teacher fields");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ApiError(409, "Email already used");

  const user = await User.create({ name, email, password, role: ROLES.TEACHER });

  const teacher = await Teacher.create({
    user: user._id,
    employeeId,
    classes: classIds,
    subjects: subjectIds,
    ...rest,
  });

  if (classIds?.length) {
    await ClassModel.updateMany({ _id: { $in: classIds } }, { $set: { teacher: teacher._id } });
  }
  if (subjectIds?.length) {
    await Subject.updateMany({ _id: { $in: subjectIds } }, { $set: { teacher: teacher._id } });
  }

  const populated = await teacher
    .populate("user", "name email role")
    .populate("subjects", "name code")
    .populate("classes", "name");

  res.status(201).json({ success: true, data: populated });
});

export const updateTeacher = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, password, classIds, subjectIds, ...rest } = req.body;

  const teacher = await Teacher.findById(id);
  if (!teacher) throw new ApiError(404, "Teacher not found");

  if (name || email || password) {
    const user = await User.findById(teacher.user);
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;
    await user.save();
  }

  if (classIds) {
    await ClassModel.updateMany({ teacher: teacher._id }, { $unset: { teacher: "" } });
    await ClassModel.updateMany({ _id: { $in: classIds } }, { $set: { teacher: teacher._id } });
    teacher.classes = classIds;
  }
  if (subjectIds) {
    await Subject.updateMany({ teacher: teacher._id }, { $unset: { teacher: "" } });
    await Subject.updateMany({ _id: { $in: subjectIds } }, { $set: { teacher: teacher._id } });
    teacher.subjects = subjectIds;
  }
  Object.assign(teacher, rest);
  await teacher.save();

  const populated = await teacher
    .populate("user", "name email role")
    .populate("subjects", "name code")
    .populate("classes", "name");

  res.json({ success: true, data: populated });
});

export const deleteTeacher = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) throw new ApiError(404, "Teacher not found");

  await ClassModel.updateMany({ teacher: teacher._id }, { $unset: { teacher: "" } });
  await Subject.updateMany({ teacher: teacher._id }, { $unset: { teacher: "" } });
  await User.findByIdAndDelete(teacher.user);
  await teacher.deleteOne();

  res.json({ success: true, message: "Teacher removed" });
});
