import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttendance, markAttendance } from "../../features/attendance/attendanceSlice.js";
import { ROLES } from "../../constants/roles.js";

const AttendancePage = () => {
  const dispatch = useDispatch();
  const classes = useSelector((state) => state.classes.items);
  const subjects = useSelector((state) => state.subjects.items);
  const teachers = useSelector((state) => state.teachers.items);
  const students = useSelector((state) => state.students.items);
  const attendance = useSelector((state) => state.attendance.records);
  const user = useSelector((state) => state.auth.user);

  const [filters, setFilters] = useState({ classId: "", subjectId: "" });
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [sessionDate, setSessionDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [recordsMap, setRecordsMap] = useState({});
  const canMarkAttendance = user?.role !== ROLES.STUDENT;

  useEffect(() => {
    dispatch(fetchAttendance());
  }, [dispatch]);

  const classStudents = useMemo(() => {
    return students.filter((student) => String(student.class?._id) === String(selectedClass));
  }, [students, selectedClass]);

  useEffect(() => {
    if (classStudents.length) {
      setRecordsMap((prev) => {
        const next = {};
        classStudents.forEach((student) => {
          next[student._id] = prev[student._id] || "present";
        });
        return next;
      });
    } else {
      setRecordsMap({});
    }
  }, [classStudents]);

  const updateRecord = (studentId, status) => {
    setRecordsMap((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAttendance = (event) => {
    event.preventDefault();
    if (!selectedClass) return;
    const payload = {
      classId: selectedClass,
      subjectId: selectedSubject || undefined,
      date: sessionDate,
      records: classStudents.map((student) => ({ studentId: student._id, status: recordsMap[student._id] || "present" })),
    };
    if (user?.role === ROLES.ADMIN) {
      payload.teacherId = selectedTeacher || undefined;
    }
    dispatch(markAttendance(payload));
  };

  const applyFilters = (event) => {
    event.preventDefault();
    dispatch(fetchAttendance({
      classId: filters.classId || undefined,
      subjectId: filters.subjectId || undefined,
    }));
  };

  const filteredAttendance = attendance;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Attendance control</p>
          <h2 className="text-2xl font-semibold text-slate-800">Attendance</h2>
        </div>
      </div>

      {canMarkAttendance ? (
        <form onSubmit={handleMarkAttendance} className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="text-sm text-slate-500">Class</label>
              <select className="w-full mt-1 border rounded-lg px-3 py-2" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} required>
                <option value="">Select class</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-500">Subject</label>
              <select className="w-full mt-1 border rounded-lg px-3 py-2" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                <option value="">Optional</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-500">Session date</label>
              <input type="date" className="w-full mt-1 border rounded-lg px-3 py-2" value={sessionDate} onChange={(e) => setSessionDate(e.target.value)} />
            </div>
            {user?.role === ROLES.ADMIN && (
              <div>
                <label className="text-sm text-slate-500">Teacher</label>
                <select className="w-full mt-1 border rounded-lg px-3 py-2" value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.target.value)} required>
                  <option value="">Select teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.user?.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {classStudents.map((student) => (
              <div key={student._id} className="flex items-center justify-between border rounded-xl px-4 py-3">
                <div>
                  <p className="font-semibold text-slate-800">{student.user?.name}</p>
                  <p className="text-xs text-slate-500">{student.rollNumber}</p>
                </div>
                <div className="flex gap-2">
                  {["present", "absent", "late"].map((status) => (
                    <button
                      type="button"
                      key={status}
                      onClick={() => updateRecord(student._id, status)}
                      className={`px-3 py-1 rounded-full text-xs capitalize border ${
                        recordsMap[student._id] === status ? "bg-brand-500 text-white border-brand-500" : "text-slate-500"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {!classStudents.length && <p className="text-sm text-slate-500">Select a class to view students.</p>}
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-brand-500 text-white font-semibold disabled:opacity-60"
            disabled={!selectedClass || classStudents.length === 0}
          >
            Save attendance
          </button>
        </form>
      ) : (
        <div className="bg-blue-50 border border-blue-100 text-blue-700 px-4 py-3 rounded-xl">
          Students can view their attendance history below.
        </div>
      )}

      <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4 shadow-sm">
        <form className="grid gap-4 md:grid-cols-4" onSubmit={applyFilters}>
          <div>
            <label className="text-xs uppercase text-slate-400">Class</label>
            <select className="w-full mt-1 border rounded-lg px-3 py-2" value={filters.classId} onChange={(e) => setFilters({ ...filters, classId: e.target.value })}>
              <option value="">All</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase text-slate-400">Subject</label>
            <select className="w-full mt-1 border rounded-lg px-3 py-2" value={filters.subjectId} onChange={(e) => setFilters({ ...filters, subjectId: e.target.value })}>
              <option value="">All</option>
              {subjects.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 flex items-end gap-3">
            <button type="submit" className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm font-semibold">
              Apply filters
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-lg border text-sm"
              onClick={() => {
                setFilters({ classId: "", subjectId: "" });
                dispatch(fetchAttendance());
              }}
            >
              Reset
            </button>
          </div>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b bg-slate-50">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Present</th>
                <th className="px-4 py-3">Absent</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map((session) => {
                const present = session.records.filter((record) => record.status === "present").length;
                const absent = session.records.filter((record) => record.status === "absent").length;
                return (
                  <tr key={session._id} className="border-b last:border-0">
                    <td className="px-4 py-3">{new Date(session.date || session.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{session.class?.name || "—"}</td>
                    <td className="px-4 py-3">{session.subject?.name || "—"}</td>
                    <td className="px-4 py-3">{present}</td>
                    <td className="px-4 py-3">{absent}</td>
                  </tr>
                );
              })}
              {!filteredAttendance.length && (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                    No attendance sessions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
