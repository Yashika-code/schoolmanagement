import ClassModel from "../models/ClassModel.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const teacherPopulate = { path: "teacher", populate: { path: "user", select: "name email role" } };

export const getClasses = asyncHandler(async (_req, res) => {
  const classes = await ClassModel.find()
    .populate(teacherPopulate)
    .populate({ path: "students", populate: { path: "user", select: "name email" } });
  res.json({ success: true, data: classes });
});

export const getClassById = asyncHandler(async (req, res) => {
  const classDoc = await ClassModel.findById(req.params.id)
    .populate(teacherPopulate)
    .populate({ path: "students", populate: { path: "user", select: "name email" } });
  if (!classDoc) throw new ApiError(404, "Class not found");
  res.json({ success: true, data: classDoc });
});

export const createClass = asyncHandler(async (req, res) => {
  const { name, description, teacherId, studentIds, schedule } = req.body;
  if (!name) throw new ApiError(400, "Class name required");

  const classDoc = await ClassModel.create({ name, description, teacher: teacherId, students: studentIds, schedule });

  if (studentIds?.length) {
    await Student.updateMany({ _id: { $in: studentIds } }, { $set: { class: classDoc._id } });
  }
  if (teacherId) {
    await Teacher.findByIdAndUpdate(teacherId, { $addToSet: { classes: classDoc._id } });
  }

  const populated = await classDoc
    .populate(teacherPopulate)
    .populate({ path: "students", populate: { path: "user", select: "name email" } });

  res.status(201).json({ success: true, data: populated });
});

export const updateClass = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { teacherId, studentIds, ...rest } = req.body;

  const classDoc = await ClassModel.findById(id);
  if (!classDoc) throw new ApiError(404, "Class not found");

  if (teacherId && teacherId !== String(classDoc.teacher)) {
    if (classDoc.teacher) {
      await Teacher.findByIdAndUpdate(classDoc.teacher, { $pull: { classes: classDoc._id } });
    }
    await Teacher.findByIdAndUpdate(teacherId, { $addToSet: { classes: classDoc._id } });
    classDoc.teacher = teacherId;
  }

  if (studentIds) {
    await Student.updateMany({ class: classDoc._id }, { $set: { class: null } });
    await Student.updateMany({ _id: { $in: studentIds } }, { $set: { class: classDoc._id } });
    classDoc.students = studentIds;
  }

  Object.assign(classDoc, rest);
  await classDoc.save();

  const populated = await classDoc
    .populate(teacherPopulate)
    .populate({ path: "students", populate: { path: "user", select: "name email" } });

  res.json({ success: true, data: populated });
});

export const deleteClass = asyncHandler(async (req, res) => {
  const classDoc = await ClassModel.findById(req.params.id);
  if (!classDoc) throw new ApiError(404, "Class not found");

  await Student.updateMany({ class: classDoc._id }, { $set: { class: null } });
  if (classDoc.teacher) {
    await Teacher.findByIdAndUpdate(classDoc.teacher, { $pull: { classes: classDoc._id } });
  }

  await classDoc.deleteOne();
  res.json({ success: true, message: "Class removed" });
});
