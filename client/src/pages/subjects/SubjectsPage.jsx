import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSubject, deleteSubject, updateSubject } from "../../features/subjects/subjectSlice.js";

const blankForm = {
  name: "",
  code: "",
  classId: "",
  teacherId: "",
  description: "",
};

const SubjectsPage = () => {
  const dispatch = useDispatch();
  const subjects = useSelector((state) => state.subjects.items);
  const classes = useSelector((state) => state.classes.items);
  const teachers = useSelector((state) => state.teachers.items);
  const [formState, setFormState] = useState(blankForm);
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = { ...formState, classId: formState.classId || undefined, teacherId: formState.teacherId || undefined };
    if (!editingId) {
      dispatch(createSubject(payload));
    } else {
      dispatch(updateSubject({ id: editingId, body: payload }));
    }
    setFormState(blankForm);
    setEditingId(null);
  };

  const startEdit = (subject) => {
    setEditingId(subject._id);
    setFormState({
      name: subject.name || "",
      code: subject.code || "",
      classId: subject.class?._id || "",
      teacherId: subject.teacher?._id || "",
      description: subject.description || "",
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this subject?")) {
      dispatch(deleteSubject(id));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">Manage subjects</p>
        <h2 className="text-2xl font-semibold text-slate-800">Subjects</h2>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800">{editingId ? "Update subject" : "Create subject"}</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-slate-500">Name</label>
              <input className="w-full mt-1 border rounded-lg px-3 py-2" value={formState.name} onChange={(e) => setFormState({ ...formState, name: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm text-slate-500">Code</label>
              <input className="w-full mt-1 border rounded-lg px-3 py-2" value={formState.code} onChange={(e) => setFormState({ ...formState, code: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm text-slate-500">Class</label>
              <select className="w-full mt-1 border rounded-lg px-3 py-2" value={formState.classId} onChange={(e) => setFormState({ ...formState, classId: e.target.value })}>
                <option value="">Unassigned</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-500">Teacher</label>
              <select className="w-full mt-1 border rounded-lg px-3 py-2" value={formState.teacherId} onChange={(e) => setFormState({ ...formState, teacherId: e.target.value })}>
                <option value="">Unassigned</option>
                {teachers.map((teacher) => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.user?.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-500">Description</label>
              <textarea className="w-full mt-1 border rounded-lg px-3 py-2" rows="3" value={formState.description} onChange={(e) => setFormState({ ...formState, description: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="w-full py-2.5 rounded-lg bg-brand-500 text-white font-semibold">
            {editingId ? "Save changes" : "Create subject"}
          </button>
        </form>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b bg-slate-50">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Teacher</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject._id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-800">{subject.name}</p>
                    <p className="text-xs text-slate-500">{subject.description || "No description"}</p>
                  </td>
                  <td className="px-4 py-3">{subject.code}</td>
                  <td className="px-4 py-3">{subject.class?.name || "—"}</td>
                  <td className="px-4 py-3">{subject.teacher?.user?.name || "—"}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button className="text-brand-500" onClick={() => startEdit(subject)}>
                      Edit
                    </button>
                    <button className="text-red-500" onClick={() => handleDelete(subject._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!subjects.length && (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                    No subjects available.
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

export default SubjectsPage;
