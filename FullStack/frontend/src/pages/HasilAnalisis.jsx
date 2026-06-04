import "../styles/HasilAnalisis.css";
import { useNavigate, useLocation } from "react-router-dom";

function HasilAnalisis() {
  const navigate = useNavigate();
  const location = useLocation();

  
  const savedData = localStorage.getItem('lastAnalysis');
  const data = location.state?.data || (savedData ? JSON.parse(savedData) : null);

  const today = new Date().toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric"
  });

  // pesan eror jika data ga ditemukan
  if (!data) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <h2>Data tidak ditemukan</h2>
        <p>Silakan lakukan analisis terlebih dahulu.</p>
        <button
          onClick={() => navigate('/input-data')}
          style={{
            marginTop: '16px', padding: '10px 24px',
            background: '#22c55e', color: 'white',
            border: 'none', borderRadius: '8px',
            cursor: 'pointer', fontWeight: 600
          }}
        >
          Kembali ke Input Data
        </button>
      </div>
    );
  }

  const probability = Math.round(data.probability * 100);
  const riskLevel = data.risk_level;
  const recommendations = data.recommendations;

  const riskConfig = {
    LOW: {
      label: '🟢 Risiko Rendah',
      className: 'risk-badge-low',
      color: '#22c55e',
      ringClass: 'ring-fill-green',
    },
    MEDIUM: {
      label: '🟡 Risiko Sedang',
      className: 'risk-badge-medium',
      color: '#f59e0b',
      ringClass: 'ring-fill-amber',
    },
    HIGH: {
      label: '🔴 Risiko Tinggi',
      className: 'risk-badge-high',
      color: '#f43f5e',
      ringClass: 'ring-fill-red',
    },
  };

  const config = riskConfig[riskLevel] || riskConfig.LOW;

  return (
    <div className="hasil-page">
      <div className="hasil-container">

        
        <div className="breadcrumb">
          <span onClick={() => navigate("/dashboard")}>🏠 Beranda</span>
          <span className="bc-sep">›</span>
          <span onClick={() => navigate("/input-data")}>Input Data</span>
          <span className="bc-sep">›</span>
          <span className="bc-current">Hasil Analisis</span>
        </div>

        
        <div className="hasil-title-row">
          <div>
            <h1>Hasil Analisis Risiko</h1>
            <p>Prediksi kondisi finansialmu berdasarkan data yang telah dimasukkan.</p>
          </div>
          <div className="hasil-date">📅 {today}</div>
        </div>

        
        <div className="risk-card">
          <div className="risk-card-header">
            <div>
              <h2>Skor Risiko Gagal Bayar</h2>
              <p>Berdasarkan analisis variabel keuangan dengan model ML</p>
            </div>
            <span className={config.className}>{config.label}</span>
          </div>

          <div className="risk-visual">
            
            <div className="risk-ring-wrap">
              <svg width="180" height="180" viewBox="0 0 180 180">
                <circle className="ring-bg" cx="90" cy="90" r="70"/>
                <circle
                  className={`ring-fill ${config.ringClass}`}
                  cx="90" cy="90" r="70"
                  style={{
                    strokeDasharray: `${probability * 4.4} 440`,
                    stroke: config.color
                  }}
                />
              </svg>
              <div className="ring-text">
                <span className="ring-percent" style={{color: config.color}}>
                  {probability}%
                </span>
                <span className="ring-label">Probabilitas</span>
              </div>
            </div>

          
            <div className="risk-breakdown">
              <div className="breakdown-item">
                <div className="breakdown-header">
                  <span className="breakdown-label">Level Risiko</span>
                  <span className="breakdown-val" style={{color: config.color}}>
                    {riskLevel}
                  </span>
                </div>
                <div className="breakdown-bar">
                  <div
                    className="breakdown-fill"
                    style={{width: `${probability}%`, background: config.color}}
                  ></div>
                </div>
              </div>

              <div className="breakdown-item">
                <div className="breakdown-header">
                  <span className="breakdown-label">Probabilitas Gagal Bayar</span>
                  <span className="breakdown-val" style={{color: config.color}}>
                    {probability}%
                  </span>
                </div>
                <div className="breakdown-bar">
                  <div
                    className="breakdown-fill"
                    style={{width: `${probability}%`, background: config.color}}
                  ></div>
                </div>
              </div>

              <div className="breakdown-item">
                <div className="breakdown-header">
                  <span className="breakdown-label">Status Prediksi</span>
                  <span className="breakdown-val" style={{color: config.color}}>
                    {data.prediction === 0 ? 'Tidak Gagal Bayar' : 'Berpotensi Gagal Bayar'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div className="cards-row">
          <div className="insight-box">
            <h3>🔍 Insight Analisis</h3>
            <ul>
              <li>{data.message}</li>
              <li>Probabilitas gagal bayar: <strong>{probability}%</strong></li>
              <li>Level risiko: <strong>{riskLevel}</strong></li>
              <li>
                Status:{' '}
                <strong>
                  {data.prediction === 0
                    ? 'Keuangan dalam kondisi aman'
                    : 'Perlu perhatian segera'}
                </strong>
              </li>
            </ul>
          </div>

          <div className="recommendation-box">
            <h3>💡 Rekomendasi Prioritas</h3>
            <ul className="rec-list">
              {recommendations?.prioritas?.map((rec, i) => (
                <li key={i}><span></span> {rec}</li>
              ))}
            </ul>
          </div>
        </div>

        
        <div className="next-steps-card">
          <div className="next-steps-text">
            <h3>Langkah Selanjutnya</h3>
            <p>
              {riskLevel === 'LOW'
                ? 'Kondisi keuanganmu bagus! Lihat rekomendasi untuk mempertahankan kebiasaan baik ini.'
                : riskLevel === 'MEDIUM'
                ? 'Ada beberapa hal yang perlu diperbaiki. Lihat rekomendasi lengkap untuk panduan.'
                : 'Jangan khawatir! Risiko tinggi bisa diturunkan. Segera lihat rekomendasi lengkap.'}
            </p>
          </div>
          <div className="next-steps-actions">
            <button
              className="btn-next-primary"
              onClick={() => navigate("/rekomendasi", { state: { data } })}
            >
              💡 Lihat Rekomendasi
            </button>
            <button
              className="btn-next-secondary"
              onClick={() => navigate("/input-data")}
            >
              🔄 Analisis Ulang
            </button>
            <button
              className="btn-next-secondary"
              onClick={() => navigate("/dashboard")}
            >
              🏠 Kembali ke Dashboard
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default HasilAnalisis;

