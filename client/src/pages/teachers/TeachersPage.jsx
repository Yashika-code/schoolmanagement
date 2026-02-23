import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTeacher, deleteTeacher, updateTeacher } from "../../features/teachers/teacherSlice.js";

const baseForm = {
  name: "",
  email: "",
  password: "",
  employeeId: "",
  classIds: [],
  subjectIds: [],
  phone: "",
  specialization: "",
};

const TeachersPage = () => {
  const dispatch = useDispatch();
  const teachers = useSelector((state) => state.teachers.items);
  const classes = useSelector((state) => state.classes.items);
  const subjects = useSelector((state) => state.subjects.items);
  const [formState, setFormState] = useState(baseForm);
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      name: formState.name,
      email: formState.email,
      password: formState.password || undefined,
      employeeId: formState.employeeId,
      classIds: formState.classIds,
      subjectIds: formState.subjectIds,
      phone: formState.phone,
      specialization: formState.specialization,
    };
    if (!editingId) {
      dispatch(createTeacher(payload));
    } else {
      if (!payload.password) delete payload.password;
      dispatch(updateTeacher({ id: editingId, body: payload }));
    }
    setFormState(baseForm);
    setEditingId(null);
  };

  const startEdit = (teacher) => {
    setEditingId(teacher._id);
    setFormState({
      name: teacher.user?.name || "",
      email: teacher.user?.email || "",
      password: "",
      employeeId: teacher.employeeId || "",
      classIds: teacher.classes?.map((cls) => cls._id) || [],
      subjectIds: teacher.subjects?.map((subj) => subj._id) || [],
      phone: teacher.phone || "",
      specialization: teacher.specialization || "",
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this teacher?")) {
      dispatch(deleteTeacher(id));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">Manage teachers</p>
        <h2 className="text-2xl font-semibold text-slate-800">Teachers</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">{editingId ? "Update teacher" : "Add teacher"}</h3>
            {editingId && (
              <button type="button" className="text-sm text-brand-500" onClick={() => { setFormState(baseForm); setEditingId(null); }}>
                Reset
              </button>
            )}
          </div>
          <div className="grid gap-4">
            <div>
              <label className="text-sm text-slate-500">Full name</label>
              <input className="w-full mt-1 border rounded-lg px-3 py-2" value={formState.name} onChange={(e) => setFormState({ ...formState, name: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm text-slate-500">Email</label>
              <input
                type="email"
                className="w-full mt-1 border rounded-lg px-3 py-2"
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                <label className="text-sm text-slate-500">Employee ID</label>
                <input
                  className="w-full mt-1 border rounded-lg px-3 py-2"
                  value={formState.employeeId}
                  onChange={(e) => setFormState({ ...formState, employeeId: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-500">Phone</label>
                <input className="w-full mt-1 border rounded-lg px-3 py-2" value={formState.phone} onChange={(e) => setFormState({ ...formState, phone: e.target.value })} />
              </div>
              <div>
                <label className="text-sm text-slate-500">Specialization</label>
                <input className="w-full mt-1 border rounded-lg px-3 py-2" value={formState.specialization} onChange={(e) => setFormState({ ...formState, specialization: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-500">Classes</label>
              <select
                multiple
                className="w-full mt-1 border rounded-lg px-3 py-2 h-24"
                value={formState.classIds}
                onChange={(e) => setFormState({ ...formState, classIds: Array.from(e.target.selectedOptions, (option) => option.value) })}
              >
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-500">Subjects</label>
              <select
                multiple
                className="w-full mt-1 border rounded-lg px-3 py-2 h-24"
                value={formState.subjectIds}
                onChange={(e) => setFormState({ ...formState, subjectIds: Array.from(e.target.selectedOptions, (option) => option.value) })}
              >
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="w-full py-2.5 rounded-lg bg-brand-500 text-white font-semibold hover:bg-brand-600">
            {editingId ? "Save changes" : "Create teacher"}
          </button>
        </form>

        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b bg-slate-50">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Employee ID</th>
                <th className="px-4 py-3">Classes</th>
                <th className="px-4 py-3">Subjects</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher._id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-800">{teacher.user?.name}</p>
                    <p className="text-xs text-slate-500">{teacher.user?.email}</p>
                  </td>
                  <td className="px-4 py-3">{teacher.employeeId}</td>
                  <td className="px-4 py-3">{teacher.classes?.length || 0}</td>
                  <td className="px-4 py-3">{teacher.subjects?.length || 0}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button className="text-brand-500" onClick={() => startEdit(teacher)}>
                      Edit
                    </button>
                    <button className="text-red-500" onClick={() => handleDelete(teacher._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!teachers.length && (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                    No teachers yet.
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

export default TeachersPage;
