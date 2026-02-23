import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { fetchAttendance } from "../../features/attendance/attendanceSlice.js";
import { ROLES } from "../../constants/roles.js";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const students = useSelector((state) => state.students.items);
  const teachers = useSelector((state) => state.teachers.items);
  const classes = useSelector((state) => state.classes.items);
  const subjects = useSelector((state) => state.subjects.items);
  const attendance = useSelector((state) => state.attendance.records);

  useEffect(() => {
    dispatch(fetchAttendance());
  }, [dispatch]);

  const stats = [
    { label: "Students", value: students.length, accent: "bg-brand-100 text-brand-700" },
    { label: "Teachers", value: teachers.length, accent: "bg-purple-100 text-purple-700" },
    { label: "Classes", value: classes.length, accent: "bg-emerald-100 text-emerald-700" },
    { label: "Subjects", value: subjects.length, accent: "bg-orange-100 text-orange-700" },
  ];

  const attendanceTrend = useMemo(() => {
    const grouped = attendance.reduce((acc, session) => {
      const label = new Date(session.date || session.createdAt).toLocaleDateString();
      const present = session.records.filter((record) => record.status === "present").length;
      const total = session.records.length;
      acc[label] = acc[label] || { date: label, present: 0, total: 0 };
      acc[label].present += present;
      acc[label].total += total;
      return acc;
    }, {});
    return Object.values(grouped).slice(-7);
  }, [attendance]);

  const teacherClasses = useMemo(() => {
    if (user?.role === ROLES.TEACHER) {
      return classes.filter((cls) => String(cls.teacher?.user?._id) === String(user?.id));
    }
    return classes;
  }, [classes, user]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">Welcome back, {user?.name}</p>
        <h2 className="text-2xl font-semibold text-slate-800">Dashboard overview</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
            <p className="text-xs uppercase tracking-wide text-slate-400">{stat.label}</p>
            <p className="text-3xl font-semibold text-slate-800 mt-2">{stat.value}</p>
            <span className={`inline-flex mt-3 px-3 py-1 text-xs font-semibold rounded-full ${stat.accent}`}>Updated live</span>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase text-slate-400">Attendance</p>
              <h3 className="text-lg font-semibold text-slate-800">Last 7 sessions</h3>
            </div>
          </div>
          {attendanceTrend.length ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="present" stroke="#2563eb" strokeWidth={3} name="Present" />
                <Line type="monotone" dataKey="total" stroke="#94a3b8" strokeWidth={2} name="Total" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-slate-500">No attendance data yet.</p>
          )}
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <div>
            <p className="text-xs uppercase text-slate-400">Classes</p>
            <h3 className="text-lg font-semibold text-slate-800">
              {user?.role === ROLES.TEACHER ? "Your active classes" : "Active classes"}
            </h3>
          </div>
          <div className="space-y-3">
            {teacherClasses.slice(0, 5).map((cls) => (
              <div key={cls._id} className="flex items-center justify-between border rounded-xl px-4 py-3">
                <div>
                  <p className="font-semibold text-slate-800">{cls.name}</p>
                  <p className="text-sm text-slate-500">{cls.students?.length || 0} students · {cls.schedule || "TBD"}</p>
                </div>
                {cls.teacher?.user?.name && <span className="text-sm text-slate-500">{cls.teacher.user.name}</span>}
              </div>
            ))}
            {!teacherClasses.length && <p className="text-sm text-slate-500">No classes assigned yet.</p>}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
