import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authSlice.js";

const Header = ({ onToggleSidebar }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
      <div className="flex items-center gap-3">
        <button className="lg:hidden text-2xl" onClick={onToggleSidebar} aria-label="Toggle navigation">
          ☰
        </button>
        <div>
          <p className="text-xs uppercase text-slate-400">Logged in as</p>
          <p className="font-semibold text-slate-800">{user?.name}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="px-3 py-1 text-xs font-semibold uppercase rounded-full bg-slate-100 text-slate-600">
          {user?.role}
        </span>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-semibold text-white rounded-full bg-brand-500 hover:bg-brand-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
