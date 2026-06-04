import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

function getStrength(pw) {
  let s = 0;
  if (pw.length >= 8)           s++;
  if (pw.length >= 12)          s++;
  if (/[A-Z]/.test(pw))         s++;
  if (/[0-9]/.test(pw))         s++;
  if (/[^A-Za-z0-9]/.test(pw))  s++;
  return s;
}
const S_LABEL = ['','Sangat Lemah','Lemah','Cukup','Kuat','Sangat Kuat'];
const S_COLOR = ['','#ef4444','#f97316','#eab308','#22c55e','#16a34a'];
const S_WIDTH = ['0%','20%','40%','60%','80%','100%'];

export default function Register() {
  const navigate     = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    fullname: '', email: '', password: '', confirm: '',
    sex: '', education: '', marriage: '', age: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [fieldErr, setFieldErr] = useState({});

  const strength = getStrength(form.password);

  const handleChange = (e) => {
    setError('');
    setFieldErr(p => ({ ...p, [e.target.name]: '' }));
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullname.trim())  e.fullname  = 'Nama wajib diisi.';
    if (!form.email)            e.email     = 'Email wajib diisi.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                e.email     = 'Format email tidak valid.';
    if (form.password.length < 8) e.password = 'Password minimal 8 karakter.';
    if (form.password !== form.confirm) e.confirm = 'Password tidak cocok.';
    if (!form.sex)              e.sex       = 'Jenis kelamin wajib dipilih.';
    if (!form.education)        e.education = 'Pendidikan wajib dipilih.';
    if (!form.marriage)         e.marriage  = 'Status pernikahan wajib dipilih.';
    if (!form.age)              e.age       = 'Usia wajib diisi.';
    else if (Number(form.age) < 18 || Number(form.age) > 100)
                                e.age       = 'Usia harus antara 18–100.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErr(errs); return; }

    setLoading(true);
    setError('');
    try {
      await register({
        fullname:  form.fullname.trim(),
        email:     form.email,
        password:  form.password,
        sex:       form.sex,
        education: form.education,
        marriage:  form.marriage,
        age:       form.age,
      });
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registrasi gagal.');
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

        <h1 className="auth-title">Buat Akun Baru ✨</h1>
        <p className="auth-subtitle">Daftar gratis dan mulai cek kondisi keuanganmu.</p>

        {error && <div className="auth-alert error">⚠️ {error}</div>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          
          <div className="auth-field">
            <label className="auth-label">Nama Lengkap</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">👤</span>
              <input name="fullname" type="text"
                className={`auth-input ${fieldErr.fullname ? 'error' : ''}`}
                placeholder="Nama lengkap kamu"
                value={form.fullname} onChange={handleChange} autoFocus />
            </div>
            {fieldErr.fullname && <span className="field-error">⚠ {fieldErr.fullname}</span>}
          </div>

        
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">✉️</span>
              <input name="email" type="email"
                className={`auth-input ${fieldErr.email ? 'error' : ''}`}
                placeholder="nama@email.com"
                value={form.email} onChange={handleChange} />
            </div>
            {fieldErr.email && <span className="field-error">⚠ {fieldErr.email}</span>}
          </div>

         
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">🔒</span>
              <input name="password"
                type={showPass ? 'text' : 'password'}
                className={`auth-input ${fieldErr.password ? 'error' : ''}`}
                placeholder="Minimal 8 karakter"
                value={form.password} onChange={handleChange} />
              <button type="button" className="auth-eye"
                onClick={() => setShowPass(p => !p)}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
            {fieldErr.password && <span className="field-error">⚠ {fieldErr.password}</span>}
            {form.password && (
              <>
                <div className="strength-bar">
                  <div className="strength-fill"
                    style={{ width: S_WIDTH[strength], background: S_COLOR[strength] }} />
                </div>
                <div className="strength-label" style={{ color: S_COLOR[strength] }}>
                  {S_LABEL[strength]}
                </div>
              </>
            )}
          </div>

         
          <div className="auth-field">
            <label className="auth-label">Konfirmasi Password</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">🔐</span>
              <input name="confirm"
                type={showPass ? 'text' : 'password'}
                className={`auth-input ${fieldErr.confirm ? 'error' : ''}`}
                placeholder="Ulangi password"
                value={form.confirm} onChange={handleChange} />
            </div>
            {fieldErr.confirm && <span className="field-error">⚠ {fieldErr.confirm}</span>}
          </div>

          
          <div style={{ borderTop: '1px solid #e5e7eb', margin: '4px 0' }} />
          <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151' }}>
            📋 Data Demografis
          </p>

         
          <div className="auth-field">
            <label className="auth-label">Jenis Kelamin</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">⚧</span>
              <select name="sex"
                className={`auth-input ${fieldErr.sex ? 'error' : ''}`}
                value={form.sex} onChange={handleChange}>
                <option value="">-- Pilih --</option>
                <option value="1">Laki-laki</option>
                <option value="2">Perempuan</option>
              </select>
            </div>
            {fieldErr.sex && <span className="field-error">⚠ {fieldErr.sex}</span>}
          </div>

         
          <div className="auth-field">
            <label className="auth-label">Pendidikan Terakhir</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">🎓</span>
              <select name="education"
                className={`auth-input ${fieldErr.education ? 'error' : ''}`}
                value={form.education} onChange={handleChange}>
                <option value="">-- Pilih --</option>
                <option value="1">Pascasarjana (S2/S3)</option>
                <option value="2">Universitas (S1/D3)</option>
                <option value="3">SMA / Sederajat</option>
                <option value="4">Lainnya</option>
              </select>
            </div>
            {fieldErr.education && <span className="field-error">⚠ {fieldErr.education}</span>}
          </div>

          
          <div className="auth-field">
            <label className="auth-label">Status</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">💍</span>
              <select name="marriage"
                className={`auth-input ${fieldErr.marriage ? 'error' : ''}`}
                value={form.marriage} onChange={handleChange}>
                <option value="">-- Pilih --</option>
                <option value="1">Menikah</option>
                <option value="2">Lajang</option>
                <option value="3">Lainnya</option>
              </select>
            </div>
            {fieldErr.marriage && <span className="field-error">⚠ {fieldErr.marriage}</span>}
          </div>

       
          <div className="auth-field">
            <label className="auth-label">Usia</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">🎂</span>
              <input name="age" type="number"
                className={`auth-input ${fieldErr.age ? 'error' : ''}`}
                placeholder="Contoh: 25"
                min="18" max="100"
                value={form.age} onChange={handleChange} />
            </div>
            {fieldErr.age && <span className="field-error">⚠ {fieldErr.age}</span>}
          </div>

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading
              ? <><div className="btn-spinner" /> Mendaftarkan...</>
              : <>Daftar Sekarang</>
            }
          </button>
        </form>

        <p className="auth-footer">
          Sudah punya akun?{' '}
          <span onClick={() => navigate('/login')}>Masuk di sini</span>
        </p>
      </div>
    </div>
  );
}