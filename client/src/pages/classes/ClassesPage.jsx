import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createClass, deleteClass, updateClass } from "../../features/classes/classSlice.js";
import { ROLES } from "../../constants/roles.js";

const defaultForm = {
  name: "",
  description: "",
  teacherId: "",
  studentIds: [],
  schedule: "",
};

const ClassesPage = () => {
  const dispatch = useDispatch();
  const classes = useSelector((state) => state.classes.items);
  const teachers = useSelector((state) => state.teachers.items);
  const students = useSelector((state) => state.students.items);
  const user = useSelector((state) => state.auth.user);
  const [formState, setFormState] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const isAdmin = user?.role === ROLES.ADMIN;

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = { ...formState, teacherId: formState.teacherId || undefined };
    if (!editingId) {
      dispatch(createClass(payload));
    } else {
      dispatch(updateClass({ id: editingId, body: payload }));
    }
    setFormState(defaultForm);
    setEditingId(null);
  };

  const startEdit = (cls) => {
    setEditingId(cls._id);
    setFormState({
      name: cls.name || "",
      description: cls.description || "",
      teacherId: cls.teacher?._id || cls.teacher || "",
      studentIds: cls.students?.map((student) => student._id) || [],
      schedule: cls.schedule || "",
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this class?")) {
      dispatch(deleteClass(id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Classes overview</p>
          <h2 className="text-2xl font-semibold text-slate-800">Classes</h2>
        </div>
        {isAdmin && (
          <button
            className="hidden lg:inline-flex px-4 py-2 rounded-lg bg-brand-500 text-white text-sm font-semibold"
            onClick={() => {
              setFormState(defaultForm);
              setEditingId(null);
            }}
          >
            New class
          </button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {isAdmin && (
          <form onSubmit={handleSubmit} className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800">{editingId ? "Update class" : "Create class"}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-slate-500">Name</label>
                <input className="w-full mt-1 border rounded-lg px-3 py-2" value={formState.name} onChange={(e) => setFormState({ ...formState, name: e.target.value })} required />
              </div>
              <div>
                <label className="text-sm text-slate-500">Description</label>
                <textarea className="w-full mt-1 border rounded-lg px-3 py-2" rows="3" value={formState.description} onChange={(e) => setFormState({ ...formState, description: e.target.value })} />
              </div>
              <div>
                <label className="text-sm text-slate-500">Schedule</label>
                <input className="w-full mt-1 border rounded-lg px-3 py-2" value={formState.schedule} onChange={(e) => setFormState({ ...formState, schedule: e.target.value })} />
              </div>
              <div>
                <label className="text-sm text-slate-500">Lead Teacher</label>
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
                <label className="text-sm text-slate-500">Students</label>
                <select
                  multiple
                  className="w-full mt-1 border rounded-lg px-3 py-2 h-32"
                  value={formState.studentIds}
                  onChange={(e) => setFormState({ ...formState, studentIds: Array.from(e.target.selectedOptions, (opt) => opt.value) })}
                >
                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.user?.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" className="w-full py-2.5 rounded-lg bg-brand-500 text-white font-semibold">
              {editingId ? "Save" : "Create"}
            </button>
          </form>
        )}

        <div className={`${isAdmin ? "lg:col-span-2" : "lg:col-span-3"} space-y-4`}>
          {classes.map((cls) => (
            <div key={cls._id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">{cls.name}</h3>
                  <p className="text-sm text-slate-500">{cls.description || "No description"}</p>
                </div>
                {isAdmin && (
                  <div className="flex gap-3 text-sm">
                    <button className="text-brand-500" onClick={() => startEdit(cls)}>
                      Edit
                    </button>
                    <button className="text-red-500" onClick={() => handleDelete(cls._id)}>
                      Delete
                    </button>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-6 text-sm text-slate-600">
                <span>
                  Teacher: <strong>{cls.teacher?.user?.name || "Unassigned"}</strong>
                </span>
                <span>
                  Students: <strong>{cls.students?.length || 0}</strong>
                </span>
                <span>
                  Schedule: <strong>{cls.schedule || "TBD"}</strong>
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {cls.students?.slice(0, 6).map((student) => (
                  <span key={student._id} className="px-3 py-1 text-xs rounded-full bg-slate-100 text-slate-600">
                    {student.user?.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {!classes.length && <p className="text-slate-500">No classes yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default ClassesPage;
