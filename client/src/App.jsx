import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import ProtectedRoute from "./components/shared/ProtectedRoute.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import DashboardPage from "./pages/dashboard/DashboardPage.jsx";
import StudentsPage from "./pages/students/StudentsPage.jsx";
import TeachersPage from "./pages/teachers/TeachersPage.jsx";
import ClassesPage from "./pages/classes/ClassesPage.jsx";
import SubjectsPage from "./pages/subjects/SubjectsPage.jsx";
import AttendancePage from "./pages/attendance/AttendancePage.jsx";
import { fetchStudents } from "./features/students/studentSlice.js";
import { fetchTeachers } from "./features/teachers/teacherSlice.js";
import { fetchClasses } from "./features/classes/classSlice.js";
import { fetchSubjects } from "./features/subjects/subjectSlice.js";
import { ROLES } from "./constants/roles.js";

const App = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(fetchStudents());
      dispatch(fetchTeachers());
      dispatch(fetchClasses());
      dispatch(fetchSubjects());
    }
  }, [dispatch, token]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/teachers" element={<TeachersPage />} />
            <Route path="/subjects" element={<SubjectsPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER]} />}>
            <Route path="/classes" element={<ClassesPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT]} />}>
            <Route path="/attendance" element={<AttendancePage />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
