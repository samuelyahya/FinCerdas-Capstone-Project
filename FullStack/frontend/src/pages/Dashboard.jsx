import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";
import {
  Home, FileText, PieChart, Lightbulb,
  Shield, Cpu, DollarSign, TrendingUp, Rocket, LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-page">

      
      <header className="top-header">
        <div className="logo-section">
          <div className="logo-icon">
            <TrendingUp size={20} />
          </div>
          <h2>Fin<span>Cerdas</span></h2>
        </div>
        <div className="badge-container">
          <span className="badge badge-ml"><Cpu size={14}/> Machine Learning</span>
          <span className="badge badge-secure"><Shield size={14}/> Data Aman</span>
          <span className="badge badge-free"><DollarSign size={14}/> Gratis</span>

          
          {user && (
            <span style={{
              fontSize: '0.82rem', fontWeight: 600, color: '#374151',
              background: '#f0fdf4', border: '1px solid #bbf7d0',
              borderRadius: 20, padding: '4px 12px'
            }}>
              👤 {user.fullname}
            </span>
          )}

    
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#fef2f2', color: '#b91c1c',
              border: '1px solid #fecaca', borderRadius: 8,
              padding: '7px 14px', fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem',
              transition: 'background .2s'
            }}
            onMouseOver={e => e.currentTarget.style.background = '#fee2e2'}
            onMouseOut={e => e.currentTarget.style.background = '#fef2f2'}
          >
            <LogOut size={14}/> Keluar
          </button>
        </div>
      </header>

      
      <div className="main-layout">

      
        <aside className="sidebar">
          <div>
            <p className="sidebar-title">Menu</p>
            <ul className="menu-list">
              <li className="active-menu"><Home size={16}/>Beranda</li>
              <li onClick={() => navigate("/input-data")}><FileText size={16}/>Input Data</li>
              <li onClick={() => navigate("/hasil-analisis")}><PieChart size={16}/>Hasil Analisis</li>
              <li onClick={() => navigate("/rekomendasi")}><Lightbulb size={16}/>Rekomendasi</li>
            </ul>
          </div>

          <div>
            <p className="sidebar-title" style={{marginTop: '24px'}}>Progress</p>
            <div className="progress-section">
              <div className="progress-item">
                <div className="circle">1</div>
                <span>Input Data</span>
              </div>
              <div className="line"></div>
              <div className="progress-item">
                <div className="circle">2</div>
                <span>Hasil Analisis</span>
              </div>
              <div className="line"></div>
              <div className="progress-item">
                <div className="circle">3</div>
                <span>Rekomendasi</span>
              </div>
            </div>

            <div className="disclaimer-box" style={{marginTop: '24px'}}>
              🔒 Data kamu diproses secara aman dan tidak disimpan permanen.
            </div>
          </div>
        </aside>
        
        <main className="dashboard-content">
          <div className="hero-card">
            
            <div className="hero-card-image">
              <img
                src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=60"
                alt=""
              />
            </div>

            <div className="hero-left">
              <h1>
                Cek Kondisi Keuanganmu,<br/>
                Cegah Risiko <em>Gagal Bayar</em>
              </h1>
              <p>
                Sistem prediksi berbasis machine learning yang menganalisis pola
                penggunaan kartu kredit untuk mendeteksi risiko gagal bayar sejak dini.
              </p>
              <button className="hero-button" onClick={() => navigate("/input-data")}>
                <Rocket size={18}/>
                Cek Risiko Sekarang
              </button>
            </div>

            <div className="hero-right">
              <div className="metric-card">
                <h2>31+</h2>
                <span>Variabel dianalisis</span>
              </div>
              <div className="metric-card">
                <h2>81%</h2>
                <span>Akurasi model</span>
              </div>
              <div className="metric-card">
                <h2>100%</h2>
                <span>Gratis untuk semua</span>
              </div>
            </div>
          </div>

          
          <div className="quick-stats-row">
            <div className="quick-stat-card">
              <div className="qs-icon qs-green">💳</div>
              <div className="qs-info">
                <strong>Siap Analisis</strong>
                <span>Isi data untuk mulai</span>
              </div>
            </div>
            <div className="quick-stat-card">
              <div className="qs-icon qs-blue">⚡</div>
              <div className="qs-info">
                <strong>&lt; 3 Detik</strong>
                <span>Waktu proses analisis</span>
              </div>
            </div>
            <div className="quick-stat-card">
              <div className="qs-icon qs-amber">🎯</div>
              <div className="qs-info">
                <strong>Rekomendasi Personal</strong>
                <span>Saran disesuaikan profilmu</span>
              </div>
            </div>
          </div>
        </main>
      </div>

    </div>
  );
}

export default Dashboard;
