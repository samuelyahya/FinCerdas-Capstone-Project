import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

export default function Login() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || '/dashboard';

  const [form, setForm]         = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleChange = (e) => {
    setError('');
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Email dan password wajib diisi.');
      return;
    }
    setLoading(true);
    try {
      await login({ email: form.email, password: form.password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login gagal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <button className="auth-back" onClick={() => navigate('/')}>
          ← Kembali ke Beranda
        </button>

        <div className="auth-logo">
          <div className="auth-logo-icon">💚</div>
          <span className="auth-logo-text">Fin<span>Cerdas</span></span>
        </div>

        <h1 className="auth-title">Selamat Datang Kembali 👋</h1>
        <p className="auth-subtitle">
          Masuk ke akun kamu untuk menganalisis kondisi keuangan.
        </p>

        {error && <div className="auth-alert error">⚠️ {error}</div>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          <div className="auth-field">
            <label className="auth-label">Email</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">✉️</span>
              <input name="email" type="email"
                className="auth-input"
                placeholder="nama@email.com"
                value={form.email} onChange={handleChange} autoFocus />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">🔒</span>
              <input name="password"
                type={showPass ? 'text' : 'password'}
                className="auth-input"
                placeholder="Masukkan password"
                value={form.password} onChange={handleChange} />
              <button type="button" className="auth-eye"
                onClick={() => setShowPass(p => !p)}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading
              ? <><div className="btn-spinner" /> Memproses...</>
              : <>🚀 Masuk</>
            }
          </button>
        </form>

        <p className="auth-footer">
          Belum punya akun?{' '}
          <span onClick={() => navigate('/register')}>Daftar sekarang</span>
        </p>
      </div>
    </div>
  );
}
