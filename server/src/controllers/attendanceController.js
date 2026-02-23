import Attendance from "../models/Attendance.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const markAttendance = asyncHandler(async (req, res) => {
  const { classId, subjectId, date, records } = req.body;
  if (!classId || !records?.length) {
    throw new ApiError(400, "Class and attendance records are required");
  }

  let teacherId = req.body.teacherId;
  if (!teacherId && req.user.role === "teacher") {
    const teacher = await Teacher.findOne({ user: req.user._id });
    teacherId = teacher?._id;
  }

  if (!teacherId) {
    throw new ApiError(400, "Teacher information missing");
  }

  const attendance = await Attendance.create({
    class: classId,
    subject: subjectId,
    date,
    records: records.map((record) => ({ student: record.studentId, status: record.status || "present" })),
    markedBy: teacherId,
  });

  const populated = await attendance
    .populate("class", "name")
    .populate("subject", "name")
    .populate({ path: "records.student", populate: { path: "user", select: "name" } });

  res.status(201).json({ success: true, data: populated });
});

export const getAttendance = asyncHandler(async (req, res) => {
  const { classId, subjectId, from, to } = req.query;
  let { studentId } = req.query;
  const query = {};
  if (classId) query.class = classId;
  if (subjectId) query.subject = subjectId;
  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to) query.date.$lte = new Date(to);
  }

  if (req.user.role === "student") {
    const student = await Student.findOne({ user: req.user._id });
    studentId = student?._id;
    if (!studentId) {
      return res.json({ success: true, data: [] });
    }
  }

  let attendanceQuery = Attendance.find(query)
    .sort({ date: -1 })
    .populate("class", "name")
    .populate("subject", "name")
    .populate("markedBy", "employeeId")
    .populate({ path: "records.student", populate: { path: "user", select: "name" } });

  const attendance = await attendanceQuery;

  let filtered = attendance;
  if (studentId) {
    filtered = attendance.map((session) => ({
      ...session.toObject(),
      records: session.records.filter((record) => String(record.student?._id) === String(studentId)),
    }));
  }

  res.json({ success: true, data: filtered });
});
