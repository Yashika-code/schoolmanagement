import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import studentReducer from "../features/students/studentSlice.js";
import teacherReducer from "../features/teachers/teacherSlice.js";
import classReducer from "../features/classes/classSlice.js";
import subjectReducer from "../features/subjects/subjectSlice.js";
import attendanceReducer from "../features/attendance/attendanceSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    students: studentReducer,
    teachers: teacherReducer,
    classes: classReducer,
    subjects: subjectReducer,
    attendance: attendanceReducer,
  },
});

export default store;
