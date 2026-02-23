import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiHome, FiUsers, FiUserCheck, FiGrid, FiBookOpen, FiCalendar } from "react-icons/fi";
import { ROLES } from "../../constants/roles.js";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: FiHome, roles: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT] },
  { to: "/students", label: "Students", icon: FiUsers, roles: [ROLES.ADMIN] },
  { to: "/teachers", label: "Teachers", icon: FiUserCheck, roles: [ROLES.ADMIN] },
  { to: "/classes", label: "Classes", icon: FiGrid, roles: [ROLES.ADMIN, ROLES.TEACHER] },
  { to: "/subjects", label: "Subjects", icon: FiBookOpen, roles: [ROLES.ADMIN] },
  { to: "/attendance", label: "Attendance", icon: FiCalendar, roles: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT] },
];

const Sidebar = ({ isOpen, onClose }) => {
  const role = useSelector((state) => state.auth.user?.role);
  const filtered = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside
      className={`bg-white shadow-lg w-64 fixed inset-y-0 z-40 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between px-6 py-5 border-b">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">SchoolOS</p>
          <p className="text-lg font-semibold text-brand-600">Management</p>
        </div>
        <button className="lg:hidden text-slate-500" onClick={onClose}>
          ✕
        </button>
      </div>
      <nav className="px-4 py-4 space-y-2 overflow-y-auto h-[calc(100%-64px)]">
        {filtered.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-brand-50 text-brand-600" : "text-slate-500 hover:bg-slate-100"
                }`
              }
            >
              <Icon className="text-lg" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
