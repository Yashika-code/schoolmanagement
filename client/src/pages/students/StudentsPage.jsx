import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createStudent, deleteStudent, updateStudent } from "../../features/students/studentSlice.js";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  rollNumber: "",
  classId: "",
  subjectIds: [],
  guardianName: "",
  contactInfo: "",
};

const StudentsPage = () => {
  const dispatch = useDispatch();
  const students = useSelector((state) => state.students.items);
  const studentStatus = useSelector((state) => state.students.status);
  const classes = useSelector((state) => state.classes.items);
  const subjects = useSelector((state) => state.subjects.items);
  const [formState, setFormState] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      name: formState.name,
      email: formState.email,
      password: formState.password || undefined,
      rollNumber: formState.rollNumber,
      classId: formState.classId || undefined,
      subjectIds: formState.subjectIds,
      guardianName: formState.guardianName,
      contactInfo: formState.contactInfo,
    };
    if (!editingId) {
      dispatch(createStudent(payload));
    } else {
      if (!payload.password) delete payload.password;
      dispatch(updateStudent({ id: editingId, body: payload }));
    }
    setFormState(emptyForm);
    setEditingId(null);
  };

  const startEdit = (student) => {
    setEditingId(student._id);
    setFormState({
      name: student.user?.name || "",
      email: student.user?.email || "",
      password: "",
      rollNumber: student.rollNumber || "",
      classId: student.class?._id || "",
      subjectIds: student.subjects?.map((sub) => sub._id) || [],
      guardianName: student.guardianName || "",
      contactInfo: student.contactInfo || "",
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this student?")) {
      dispatch(deleteStudent(id));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">Manage student records</p>
        <h2 className="text-2xl font-semibold text-slate-800">Students</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">{editingId ? "Update student" : "Add new student"}</h3>
            {editingId && (
              <button type="button" className="text-sm text-brand-500" onClick={() => { setFormState(emptyForm); setEditingId(null); }}>
                Reset
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-sm text-slate-500">Full name</label>
              <input
                className="w-full mt-1 border rounded-lg px-3 py-2"
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                required
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm text-slate-500">Email</label>
              <input
                type="email"
                className="w-full mt-1 border rounded-lg px-3 py-2"
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm text-slate-500">Password</label>
              <input
                type="password"
                className="w-full mt-1 border rounded-lg px-3 py-2"
                value={formState.password}
                onChange={(e) => setFormState({ ...formState, password: e.target.value })}
                required={!editingId}
              />
            </div>
            <div>
              <label className="text-sm text-slate-500">Roll Number</label>
              <input
                className="w-full mt-1 border rounded-lg px-3 py-2"
                value={formState.rollNumber}
                onChange={(e) => setFormState({ ...formState, rollNumber: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm text-slate-500">Class</label>
              <select
                className="w-full mt-1 border rounded-lg px-3 py-2"
                value={formState.classId}
                onChange={(e) => setFormState({ ...formState, classId: e.target.value })}
              >
                <option value="">Select</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-500">Guardian</label>
              <input
                className="w-full mt-1 border rounded-lg px-3 py-2"
                value={formState.guardianName}
                onChange={(e) => setFormState({ ...formState, guardianName: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm text-slate-500">Contact Info</label>
              <input
                className="w-full mt-1 border rounded-lg px-3 py-2"
                value={formState.contactInfo}
                onChange={(e) => setFormState({ ...formState, contactInfo: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm text-slate-500">Subjects</label>
              <select
                multiple
                className="w-full mt-1 border rounded-lg px-3 py-2 h-24"
                value={formState.subjectIds}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    subjectIds: Array.from(e.target.selectedOptions, (option) => option.value),
                  })
                }
              >
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-brand-500 text-white font-semibold hover:bg-brand-600"
            disabled={studentStatus === "loading"}
          >
            {editingId ? "Save changes" : "Create student"}
          </button>
        </form>

        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b bg-slate-50">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Roll</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-800">{student.user?.name}</p>
                    <p className="text-xs text-slate-500">{student.subjects?.length || 0} subjects</p>
                  </td>
                  <td className="px-4 py-3">{student.user?.email}</td>
                  <td className="px-4 py-3">{student.class?.name || "—"}</td>
                  <td className="px-4 py-3">{student.rollNumber}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button className="text-brand-500" onClick={() => startEdit(student)}>
                      Edit
                    </button>
                    <button className="text-red-500" onClick={() => handleDelete(student._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!students.length && (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                    No students found.
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

export default StudentsPage;
