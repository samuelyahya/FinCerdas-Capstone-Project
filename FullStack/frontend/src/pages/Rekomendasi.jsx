import "../styles/Dashboard.css";
import "../styles/Rekomendasi.css";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, FileText, PieChart, Lightbulb, Shield, Cpu, DollarSign, TrendingUp } from "lucide-react";

function Rekomendasi() {
  const navigate = useNavigate();
  const location = useLocation();

 
  const savedData = localStorage.getItem('lastAnalysis');
  const data = location.state?.data || (savedData ? JSON.parse(savedData) : null);
  const recommendations = data?.recommendations;

  return (
    <div className="input-page">
      <header className="top-header">
        <div className="logo-section">
          <div className="logo-icon"><TrendingUp size={20}/></div>
          <h2>Fin<span>Cerdas</span></h2>
        </div>
        <div className="badge-container">
          <span className="badge badge-ml"><Cpu size={14}/> Machine Learning</span>
          <span className="badge badge-secure"><Shield size={14}/> Data Aman</span>
          <span className="badge badge-free"><DollarSign size={14}/> Gratis</span>
        </div>
      </header>

      <div className="main-layout">
        <aside className="sidebar">
          <div>
            <p className="sidebar-title">Menu</p>
            <ul className="menu-list">
              <li onClick={() => navigate("/dashboard")}><Home size={16}/>Beranda</li>
              <li onClick={() => navigate("/input-data")}><FileText size={16}/>Input Data</li>
              <li onClick={() => navigate("/hasil-analisis")}><PieChart size={16}/>Hasil Analisis</li>
              <li className="active-menu"><Lightbulb size={16}/>Rekomendasi</li>
            </ul>
          </div>
          <div>
            <p className="sidebar-title" style={{marginTop:'24px'}}>Progress</p>
            <div className="progress-section">
              <div className="progress-item">
                <div className="circle active-circle">1</div>
                <span>Input Data</span>
              </div>
              <div className="line"></div>
              <div className="progress-item">
                <div className="circle active-circle">2</div>
                <span>Hasil Analisis</span>
              </div>
              <div className="line"></div>
              <div className="progress-item">
                <div className="circle active-circle">3</div>
                <span>Rekomendasi</span>
              </div>
            </div>
            <div className="disclaimer-box" style={{marginTop:'24px'}}>
              🔒 Data kamu diproses secara aman dan tidak disimpan
            </div>
          </div>
        </aside>

        <main className="content">
          <div className="page-header">
            <h1>Rekomendasi</h1>
            <p>Berikut rekomendasi keuanganmu berdasarkan data yang dimasukkan</p>
          </div>

          {!recommendations ? (
            // Kalau tidak ada data, tampilkan pesan
            <div style={{
              textAlign: 'center', padding: '40px',
              background: '#f9fafb', borderRadius: '12px'
            }}>
              <p style={{fontSize: '1.1rem', color: '#6b7280'}}>
                Belum ada data rekomendasi.
              </p>
              <button
                onClick={() => navigate('/input-data')}
                style={{
                  marginTop: '16px', padding: '10px 24px',
                  background: '#22c55e', color: 'white',
                  border: 'none', borderRadius: '8px',
                  cursor: 'pointer', fontWeight: 600
                }}
              >
                Mulai Analisis
              </button>
            </div>
          ) : (
            <>
              
              <div className="rec3-grid">

                <div className="rec3-card rec3-red">
                  <div className="rec3-card-top">
                    <span className="rec3-icon">🕐</span>
                    <span className="rec3-badge rec3-badge-red">Prioritas Utama</span>
                  </div>
                  <h3>Tindakan Segera</h3>
                  <ul style={{paddingLeft:'16px', margin:'8px 0 0 0', fontSize:'0.85rem', lineHeight:'1.6'}}>
                    {recommendations.prioritas?.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>

                <div className="rec3-card rec3-yellow">
                  <div className="rec3-card-top">
                    <span className="rec3-icon">📉</span>
                    <span className="rec3-badge rec3-badge-yellow">Penting</span>
                  </div>
                  <h3>Langkah Penting</h3>
                  <ul style={{paddingLeft:'16px', margin:'8px 0 0 0', fontSize:'0.85rem', lineHeight:'1.6'}}>
                    {recommendations.penting?.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>

                <div className="rec3-card rec3-green">
                  <div className="rec3-card-top">
                    <span className="rec3-icon">📈</span>
                    <span className="rec3-badge rec3-badge-green">Tips Jangka Panjang</span>
                  </div>
                  <h3>Kebiasaan Jangka Panjang</h3>
                  <ul style={{paddingLeft:'16px', margin:'8px 0 0 0', fontSize:'0.85rem', lineHeight:'1.6'}}>
                    {recommendations.jangka_panjang?.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>

              </div>

              
              <div className="rec3-motivasi">
                <div className="rec3-motivasi-top">
                  <span className="rec3-heart">💗</span>
                  <span className="rec3-motivasi-label">PESAN UNTUK KAMU</span>
                </div>
                <h2>"Mengetahui masalah adalah langkah pertama yang paling berani. Kamu sudah melakukannya."</h2>
                <p>Kondisi keuangan bisa diperbaiki, asalkan dimulai dari kesadaran. Ikuti rekomendasi di atas satu persatu - tidak perlu sempurna sekaligus. Perubahan kecil yang konsisten jauh lebih kuat dari perubahan besar yang tidak bertahan.</p>
              </div>

             
              <div style={{
                display: 'flex', gap: '12px',
                justifyContent: 'center', marginTop: '24px'
              }}>
                <button
                  onClick={() => navigate('/input-data')}
                  style={{
                    padding: '10px 24px', background: 'white',
                    color: '#374151', border: '1px solid #d1d5db',
                    borderRadius: '8px', cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  🔄 Analisis Ulang
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  style={{
                    padding: '10px 24px', background: '#22c55e',
                    color: 'white', border: 'none',
                    borderRadius: '8px', cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  🏠 Kembali ke Dashboard
                </button>
              </div>
            </>
          )}

        </main>
      </div>
    </div>
  );
}

export default Rekomendasi;
