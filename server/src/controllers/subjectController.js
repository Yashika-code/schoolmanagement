import Subject from "../models/Subject.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const classPopulate = { path: "class", select: "name" };
const teacherPopulate = { path: "teacher", populate: { path: "user", select: "name email role" } };

export const getSubjects = asyncHandler(async (_req, res) => {
  const subjects = await Subject.find().populate(classPopulate).populate(teacherPopulate);
  res.json({ success: true, data: subjects });
});

export const getSubjectById = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id).populate(classPopulate).populate(teacherPopulate);
  if (!subject) throw new ApiError(404, "Subject not found");
  res.json({ success: true, data: subject });
});

export const createSubject = asyncHandler(async (req, res) => {
  const { name, code, classId, teacherId, description } = req.body;
  if (!name || !code) throw new ApiError(400, "Name and code required");

  const subject = await Subject.create({ name, code, class: classId, teacher: teacherId, description });
  const populated = await subject.populate(classPopulate).populate(teacherPopulate);
  res.status(201).json({ success: true, data: populated });
});

export const updateSubject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const subject = await Subject.findById(id);
  if (!subject) throw new ApiError(404, "Subject not found");

  Object.assign(subject, {
    name: req.body.name ?? subject.name,
    code: req.body.code ?? subject.code,
    class: req.body.classId ?? subject.class,
    teacher: req.body.teacherId ?? subject.teacher,
    description: req.body.description ?? subject.description,
  });

  await subject.save();
  const populated = await subject.populate(classPopulate).populate(teacherPopulate);
  res.json({ success: true, data: populated });
});

export const deleteSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id);
  if (!subject) throw new ApiError(404, "Subject not found");
  await subject.deleteOne();
  res.json({ success: true, message: "Subject removed" });
});
