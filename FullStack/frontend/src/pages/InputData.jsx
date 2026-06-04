import "../styles/Dashboard.css";
import "../styles/InputData.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home, FileText, PieChart, Lightbulb,
  Shield, Cpu, DollarSign, TrendingUp,
  RotateCcw, ArrowRight,
} from "lucide-react";
import api from "../utils/api";

// Format angka jadi ribuan: 50000000 jdi 50.000.000
const formatRibuan = (val) => {
  if (!val && val !== 0) return '';
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// Hapus titik, ambil angka aslinya: 50.000.000 jadi 50000000
const parseRibuan = (val) => {
  return val.replace(/\./g, '');
};

function InputData() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  
  const [displayForm, setDisplayForm] = useState({
    limit_bal: '',
    bill_amt1: '', bill_amt2: '', bill_amt3: '',
    pay_amt1: '', pay_amt2: '', pay_amt3: '',
  });

  
  const [rawForm, setRawForm] = useState({
    limit_bal: '',
    bill_amt1: '', bill_amt2: '', bill_amt3: '',
    pay_amt1: '', pay_amt2: '', pay_amt3: '',
    pay_1: '', pay_2: '', pay_3: ''
  });

  
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const cleaned = parseRibuan(value).replace(/[^0-9]/g, '');
    setDisplayForm(prev => ({
      ...prev,
      [name]: formatRibuan(cleaned)
    }));
    setRawForm(prev => ({
      ...prev,
      [name]: cleaned === '' ? '' : Number(cleaned)
    }));
  };

  
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setRawForm(prev => ({
      ...prev,
      [name]: value === '' ? '' : Number(value)
    }));
  };

  const handleReset = () => {
    setDisplayForm({
      limit_bal: '',
      bill_amt1: '', bill_amt2: '', bill_amt3: '',
      pay_amt1: '', pay_amt2: '', pay_amt3: '',
    });
    setRawForm({
      limit_bal: '',
      bill_amt1: '', bill_amt2: '', bill_amt3: '',
      pay_amt1: '', pay_amt2: '', pay_amt3: '',
      pay_1: '', pay_2: '', pay_3: ''
    });
    setError('');
  };

  const handleSubmit = async () => {
    const isEmpty = Object.values(rawForm).some((v) => v === '' || v === null);
    if (isEmpty) {
      setError('Semua field wajib diisi!');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/predict', rawForm);
      localStorage.setItem('lastAnalysis', JSON.stringify(response.data.data));
      navigate('/hasil-analisis', { state: { data: response.data.data } });
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal melakukan analisis. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const payFields = [
    { name: 'pay_1', label: 'Bulan Ini' },
    { name: 'pay_2', label: 'Bulan Lalu' },
    { name: 'pay_3', label: '2 Bulan Lalu' },
  ];

  const numberFields = [
    { name: 'limit_bal', label: 'Limit Kredit (Rp)', withIcon: true },
  ];

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
              <li className="active-menu"><FileText size={16}/>Input Data</li>
              <li onClick={() => navigate("/hasil-analisis")}><PieChart size={16}/>Hasil Analisis</li>
              <li onClick={() => navigate("/rekomendasi")}><Lightbulb size={16}/>Rekomendasi</li>
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
                <div className="circle">2</div>
                <span>Hasil Analisis</span>
              </div>
              <div className="line"></div>
              <div className="progress-item">
                <div className="circle">3</div>
                <span>Rekomendasi</span>
              </div>
            </div>
            <div className="disclaimer-box" style={{marginTop:'24px'}}>
              🔒 Data kamu diproses aman dan tidak disimpan.
            </div>
          </div>
        </aside>

        
        <main className="content">
          <div className="page-header">
            <h1>Input Data Keuangan</h1>
            <p>Isi data di bawah sesuai kartu kreditmu. Semua field wajib diisi.</p>
          </div>

          
          <div className="tips-card">
            <span className="tips-icon">💡</span>
            <div className="tips-text">
              <strong>Tips Pengisian Data</strong>
              <p>Masukkan angka, titik pemisah ribuan akan muncul otomatis. Contoh: ketik 50000000 → tampil 50.000.000</p>
            </div>
          </div>

          
          {error && (
            <div style={{
              background: '#fee2e2', color: '#dc2626',
              padding: '12px 16px', borderRadius: '8px',
              marginBottom: '16px', fontSize: '14px'
            }}>
              ⚠️ {error}
            </div>
          )}

          <div className="form-wrapper">

            
            <div className="form-card">
              <h2>Data Kartu Kredit</h2>

              <div className="form-group">
                <label>Limit Kredit (Rp)</label>
                <div className="input-with-icon">
                  <span className="input-icon">Rp</span>
                  <input
                    type="text"
                    name="limit_bal"
                    placeholder="Contoh: 50.000.000"
                    value={displayForm.limit_bal}
                    onChange={handleNumberChange}
                  />
                </div>
              </div>

              <div className="double-input">
                <div className="form-group">
                  <label>Tagihan Bulan Ini</label>
                  <div className="input-with-icon">
                    <span className="input-icon">Rp</span>
                    <input
                      type="text"
                      name="bill_amt1"
                      placeholder="0"
                      value={displayForm.bill_amt1}
                      onChange={handleNumberChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Tagihan Bulan Lalu</label>
                  <div className="input-with-icon">
                    <span className="input-icon">Rp</span>
                    <input
                      type="text"
                      name="bill_amt2"
                      placeholder="0"
                      value={displayForm.bill_amt2}
                      onChange={handleNumberChange}
                    />
                  </div>
                </div>
              </div>

              <div className="double-input">
                <div className="form-group">
                  <label>Tagihan 2 Bulan Lalu</label>
                  <div className="input-with-icon">
                    <span className="input-icon">Rp</span>
                    <input
                      type="text"
                      name="bill_amt3"
                      placeholder="0"
                      value={displayForm.bill_amt3}
                      onChange={handleNumberChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Pembayaran Bulan Ini</label>
                  <div className="input-with-icon">
                    <span className="input-icon">Rp</span>
                    <input
                      type="text"
                      name="pay_amt1"
                      placeholder="0"
                      value={displayForm.pay_amt1}
                      onChange={handleNumberChange}
                    />
                  </div>
                </div>
              </div>

              <div className="double-input">
                <div className="form-group">
                  <label>Pembayaran Bulan Lalu</label>
                  <div className="input-with-icon">
                    <span className="input-icon">Rp</span>
                    <input
                      type="text"
                      name="pay_amt2"
                      placeholder="0"
                      value={displayForm.pay_amt2}
                      onChange={handleNumberChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Pembayaran 2 Bulan Lalu</label>
                  <div className="input-with-icon">
                    <span className="input-icon">Rp</span>
                    <input
                      type="text"
                      name="pay_amt3"
                      placeholder="0"
                      value={displayForm.pay_amt3}
                      onChange={handleNumberChange}
                    />
                  </div>
                </div>
              </div>

            </div>

            
            <div className="form-card">
              <h2>Riwayat Pembayaran</h2>
              <p style={{fontSize:'0.8rem', color:'#6b7280', marginBottom:'16px'}}>
                Status pembayaran kartu kredit per bulan
              </p>

              {payFields.map((field) => (
                <div className="form-group" key={field.name}>
                  <label>{field.label}</label>
                  <div className="select-wrapper">
                    <select
                      name={field.name}
                      value={rawForm[field.name]}
                      onChange={handleSelectChange}
                    >
                      <option value="" disabled>Pilih status pembayaran</option>
                      <option value="-2">Tidak Ada Transaksi</option>
                      <option value="-1">Bayar Lunas</option>
                      <option value="0">Bayar Minimum (Revolving)</option>
                      <option value="1">Terlambat 1 Bulan</option>
                      <option value="2">Terlambat 2 Bulan</option>
                      <option value="3">Terlambat 3+ Bulan</option>
                    </select>
                  </div>
                </div>
              ))}

              <div style={{
                background: '#f0fdf4', border: '1px solid #bbf7d0',
                borderRadius: '8px', padding: '12px', marginTop: '16px',
                fontSize: '0.78rem', color: '#166534'
              }}>
                <strong>Keterangan:</strong>
                <ul style={{margin:'6px 0 0 0', paddingLeft:'16px'}}>
                  <li>Tidak Ada Transaksi = tidak menggunakan kartu</li>
                  <li>Bayar Lunas = membayar tagihan penuh</li>
                  <li>Bayar Minimum = hanya bayar minimum</li>
                  <li>Terlambat = pembayaran melebihi jatuh tempo</li>
                </ul>
              </div>
            </div>

          </div>

          
          <div className="button-group">
            <button className="reset-btn" onClick={handleReset}>
              <RotateCcw size={15}/>
              Reset Form
            </button>
            <button
              className="analyze-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Menganalisis...' : 'Analisis Sekarang'}
              {!loading && <ArrowRight size={18}/>}
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}

export default InputData;