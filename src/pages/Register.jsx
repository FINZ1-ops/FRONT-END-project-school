import { useState } from "react";
import { register } from "../api/auth.api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    role: "cashier",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await register(form);
      setSuccess("Akun berhasil dibuat! Mengarahkan ke halaman login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || "Registrasi gagal. Coba lagi.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <span className="login-logo-icon">✦</span>
          <span className="login-logo-text">FashionStore</span>
        </div>

        <h2 className="login-title">Buat Akun Baru</h2>
        <p className="login-subtitle">Daftarkan akun untuk mengakses dashboard</p>

        {error && <div className="login-error">{error}</div>}
        {success && <div className="login-success">{success}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nama Lengkap</label>
            <input
              className="form-control"
              type="text"
              name="fullname"
              placeholder="Nama lengkap"
              value={form.fullname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              className="form-control"
              type="text"
              name="username"
              placeholder="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              className="form-control"
              type="email"
              name="email"
              placeholder="email@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-password-wrap">
              <input
                className="form-control"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Role</label>
            <select
              className="form-control"
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="cashier">Cashier</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>

        <p className="login-register-link">
          Sudah punya akun?{" "}
          <Link to="/login">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}
