import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../features/auth/authSlice.js";
import { ROLES } from "../../constants/roles.js";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, token } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: ROLES.STUDENT });

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(registerUser(formData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-brand-100 to-brand-50 px-4">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <p className="text-xs uppercase tracking-wide text-brand-500">SchoolOS</p>
          <h1 className="text-2xl font-semibold text-slate-800">Create Account</h1>
          <p className="text-sm text-slate-500">Register as admin, teacher, or student.</p>
        </div>
        {error && <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Full name</label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
              value={formData.password}
              minLength={6}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Role</label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value={ROLES.ADMIN}>Admin</option>
              <option value={ROLES.TEACHER}>Teacher</option>
              <option value={ROLES.STUDENT}>Student</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-brand-500 text-white font-semibold hover:bg-brand-600 transition-colors disabled:opacity-70"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Creating account..." : "Register"}
          </button>
        </form>
        <div className="text-sm text-slate-500 text-center">
          Already registered?{" "}
          <Link to="/login" className="text-brand-600 font-semibold">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
