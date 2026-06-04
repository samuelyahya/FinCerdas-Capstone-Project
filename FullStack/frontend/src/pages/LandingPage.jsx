import "../styles/LandingPage.css";
import { useNavigate } from "react-router-dom";

// Helper smooth scroll
const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">

      {/* NAVBAR */}
      <nav className="navbar">
        <h2 className="logo" onClick={() => scrollTo("beranda")} style={{cursor:"pointer"}}>
          Fin<span>Cerdas</span>
          <span className="logo-dot"></span>
        </h2>
        <ul className="nav-links">
          <li onClick={() => scrollTo("beranda")}>Beranda</li>
          <li onClick={() => scrollTo("fitur")}>Fitur</li>
          <li onClick={() => scrollTo("cara-kerja")}>Cara Kerja</li>
          <li onClick={() => scrollTo("tentang")}>Tentang</li>
        </ul>
        <button className="nav-button" onClick={() => navigate("/dashboard")}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          Mulai Gratis
        </button>
      </nav>

      {/* HERO — id="beranda" */}
      <section id="beranda" className="hero-section">
        <div className="hero-blob-1"></div>
        <div className="hero-blob-2"></div>
        <div className="hero-blob-3"></div>

        <div className="hero-inner">
          {/* LEFT */}
          <div className="hero-left">
            <div className="hero-tag">
              <span className="hero-tag-dot"></span>
              🤖 Powered by Machine Learning
            </div>

            {/* FIX: hapus <br/> dan pakai white-space normal agar tidak pecah */}
            <h1>
              Cek Risiko <span className="highlight">Kredit</span>mu Sebelum Terlambat
            </h1>

            <p>
              Prediksi risiko gagal bayar kartu kredit secara real-time.
              Analisis 31+ variabel keuangan dengan akurasi tinggi berbasis AI.
            </p>

            <div className="hero-cta-group">
              <button className="btn-primary" onClick={() => navigate("/dashboard")}>
                Cek Risiko Sekarang
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
              <span className="btn-secondary-link" onClick={() => scrollTo("cara-kerja")}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Lihat Demo
              </span>
            </div>

            <div className="hero-social-proof">
              <div className="social-avatars">
                <span>AR</span>
                <span>BK</span>
                <span>CL</span>
              </div>
              <p className="social-text">
                Dipercaya <strong>2.500+</strong> pengguna aktif
              </p>
            </div>
          </div>

          {/* RIGHT — Hero Image */}
          <div className="hero-right">
            <div className="hero-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80"
                alt="Credit card financial analysis"
              />
              <div className="hero-image-overlay"></div>
            </div>

            <div className="float-card float-card-1">
              <div className="float-icon float-icon-green">🛡️</div>
              <div className="float-text">
                <strong>Data Aman</strong>
                <span>Enkripsi 256-bit</span>
              </div>
            </div>

            <div className="float-card float-card-2">
              <div className="float-icon float-icon-coral">⚡</div>
              <div className="float-text">
                <strong>Analisis Instan</strong>
                <span>Hasil &lt; 3 detik</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-number">31+</span>
          <p className="stat-label">Variabel Dianalisis</p>
        </div>
        <div className="stat-item">
          <span className="stat-number">81%</span>
          <p className="stat-label">Akurasi Model ML</p>
        </div>
        <div className="stat-item">
          <span className="stat-number">100%</span>
          <p className="stat-label">Gratis Untuk Semua</p>
        </div>
      </div>

      
      <section id="tentang" className="credit-photos-section">
        <div className="section-header">
          <span className="section-tag">💳 Kenapa Penting</span>
          <h2>Risiko Kredit Ada di Sekitar Kita</h2>
          <p>Jutaan orang kesulitan mengelola kartu kredit. FinCerdas hadir untuk membantu.</p>
        </div>
        <div className="photos-row">
          <div className="photo-card">
            <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=80" alt="Credit card usage"/>
            <span className="photo-card-label">💳 Kartu Kredit</span>
          </div>
          <div className="photo-card">
            <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80" alt="Financial analysis"/>
            <span className="photo-card-label">📊 Analisis</span>
          </div>
          <div className="photo-card">
            <img src="https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=600&q=80" alt="Financial freedom"/>
            <span className="photo-card-label">🎯 Kendali Keuangan</span>
          </div>
        </div>
      </section>

      
      <section id="fitur" className="features-section">
        <div className="section-header">
          <span className="section-tag">✨ Fitur Unggulan</span>
          <h2>Semua yang Kamu Butuhkan</h2>
          <p>Tiga langkah mudah untuk memahami kondisi keuangan dan risiko kreditmu.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrap feature-icon-green">💳</div>
            <h3>Input Data Kredit</h3>
            <p>Masukkan data limit, tagihan, dan riwayat pembayaran kartu kreditmu dengan mudah dan aman.</p>
            <span className="feature-arrow">Coba Sekarang →</span>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrap feature-icon-sky">🤖</div>
            <h3>Analisis AI Instan</h3>
            <p>Model machine learning menganalisis 31+ variabel untuk mendeteksi risiko gagal bayar secara akurat.</p>
            <span className="feature-arrow">Pelajari →</span>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrap feature-icon-violet">💡</div>
            <h3>Rekomendasi Personal</h3>
            <p>Dapatkan saran keuangan yang dipersonalisasi berdasarkan hasil analisis profil risikomu.</p>
            <span className="feature-arrow">Lihat Contoh →</span>
          </div>
        </div>
      </section>

      
      <section id="cara-kerja" className="howitworks-section">
        <div className="section-header">
          <span className="section-tag">🚀 Cara Kerja</span>
          <h2>Cuma 3 Langkah Mudah</h2>
          <p>Proses cepat, akurat, dan gratis sepenuhnya.</p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-num">1</div>
            <h3>Isi Data Keuanganmu</h3>
            <p>Masukkan data tagihan, limit kredit, dan riwayat pembayaran selama 6 bulan terakhir.</p>
          </div>
          <div className="step-card">
            <div className="step-num">2</div>
            <h3>AI Menganalisis</h3>
            <p>Model ML kami memproses data secara real-time dan menghitung skor risiko gagal bayarmu.</p>
          </div>
          <div className="step-card">
            <div className="step-num">3</div>
            <h3>Terima Hasilnya</h3>
            <p>Lihat skor risiko, insight mendalam, dan rekomendasi personal untuk perbaiki kondisi keuanganmu.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-blob cta-blob-1"></div>
        <div className="cta-blob cta-blob-2"></div>
        <div className="cta-inner">
          <h2>Mulai Cek <span>Risikomu</span><br/>Sekarang, Gratis!</h2>
          <p>Tidak perlu daftar. Tidak perlu kartu kredit. Langsung analisis dalam 60 detik.</p>
          <button className="btn-cta" onClick={() => navigate("/dashboard")}>
            🚀 Mulai Analisis Gratis
          </button>
        </div>
      </section>

      
      <footer className="landing-footer">
        © 2025 <span>FinCerdas</span> — Dibuat dengan 💚 untuk generasi cerdas finansial
      </footer>

    </div>
  );
}

export default LandingPage;
