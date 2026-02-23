import Student from "../models/Student.js";
import User from "../models/User.js";
import ClassModel from "../models/ClassModel.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ROLES } from "../config/roles.js";

export const getStudents = asyncHandler(async (req, res) => {
  const query = {};
  if (req.user.role === ROLES.STUDENT) {
    query.user = req.user._id;
  }
  const students = await Student.find(query)
    .populate("user", "name email role")
    .populate("class", "name")
    .populate("subjects", "name code");
  res.json({ success: true, data: students });
});

export const getStudentById = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id)
    .populate("user", "name email role")
    .populate("class", "name")
    .populate("subjects", "name code");
  if (!student) throw new ApiError(404, "Student not found");
  if (req.user.role === ROLES.STUDENT && String(student.user._id || student.user) !== String(req.user._id)) {
    throw new ApiError(403, "You can only view your own record");
  }
  res.json({ success: true, data: student });
});

export const createStudent = asyncHandler(async (req, res) => {
  const { name, email, password, rollNumber, classId, subjectIds, ...rest } = req.body;
  if (!name || !email || !password || !rollNumber) {
    throw new ApiError(400, "Missing required student fields");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ApiError(409, "Email already used");

  const user = await User.create({ name, email, password, role: ROLES.STUDENT });

  const student = await Student.create({
    user: user._id,
    rollNumber,
    class: classId,
    subjects: subjectIds,
    ...rest,
  });

  if (classId) {
    await ClassModel.findByIdAndUpdate(classId, { $addToSet: { students: student._id } });
  }

  const populated = await student
    .populate("user", "name email role")
    .populate("class", "name")
    .populate("subjects", "name code");

  res.status(201).json({ success: true, data: populated });
});

export const updateStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, password, classId, subjectIds, ...rest } = req.body;

  const student = await Student.findById(id);
  if (!student) throw new ApiError(404, "Student not found");

  if (name || email || password) {
    const user = await User.findById(student.user);
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;
    await user.save();
  }

  if (classId && classId !== String(student.class)) {
    if (student.class) {
      await ClassModel.findByIdAndUpdate(student.class, { $pull: { students: student._id } });
    }
    await ClassModel.findByIdAndUpdate(classId, { $addToSet: { students: student._id } });
    student.class = classId;
  }
  if (subjectIds) student.subjects = subjectIds;
  Object.assign(student, rest);

  await student.save();

  const populated = await student
    .populate("user", "name email role")
    .populate("class", "name")
    .populate("subjects", "name code");

  res.json({ success: true, data: populated });
});

export const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) throw new ApiError(404, "Student not found");

  await ClassModel.updateMany({}, { $pull: { students: student._id } });
  await User.findByIdAndDelete(student.user);
  await student.deleteOne();

  res.json({ success: true, message: "Student removed" });
});
