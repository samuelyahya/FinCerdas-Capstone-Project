# 💳 FinCerdas - Sistem Pengelolaan Keuangan dan Prediksi Gagal Bayar untuk Meningkatkan Inklusi Keuangan Generasi Muda


**FinCerdas** adalah sebuah sistem berbasis kecerdasan buatan (AI) dan aplikasi modern untuk memprediksi serta mengelola risiko gagal bayar (*credit default*) kartu kredit nasabah secara cerdas. 

Proyek ini dibangun sebagai bagian dari Capstone Project dengan arsitektur monorepo yang terbagi ke dalam tiga modul utama: **DS** (Analisis Data & Dashboard Streamlit), **AI** (Backend API & Machine Learning), dan **FullStack** (Aplikasi Dashboard & Antarmuka Pengguna).

---

## 📁 Struktur Repositori

Repositori ini disusun secara modular untuk memisahkan analisis data science, logika kecerdasan buatan, dan aplikasi dashboard utama:

```text
FinCerdas-Capstone-Project/
├── DS/                 # Modul Data Science (Notebook Analisis & Dashboard Streamlit)
│   ├── Dashboard Streamlit/ # Dashboard visualisasi data interaktif
│   ├── Notebook/       # Jupyter Notebook untuk EDA & Feature Engineering
│   └── README.md       # Dokumentasi detail analisis & cara menjalankan Streamlit
├── AI/                 # Modul Machine Learning / Deep Learning & FastAPI (Backend AI)
│   ├── app.py          # FastAPI Server
│   ├── README.md       # Dokumentasi setup detail & spesifikasi API modul AI
│   └── ...             # Model TensorFlow, dataset, & pipeline preprocessing
├── FullStack/          # Modul Aplikasi Web Dashboard & Manajemen Pengguna
│   └── ...             # Kode program antarmuka dashboard utama (Frontend & Backend Client)
├── .gitignore          # File konfigurasi Git ignore global
└── README.md           # Dokumentasi utama seluruh proyek (File ini)
```

---

## Komponen 1: DS (Data Science & Analytics)

Modul **DS** berfokus pada analisis data eksploratif (EDA), rekayasa fitur (feature engineering), serta visualisasi metrik data dan performa model melalui dashboard interaktif.

- **Teknologi**: Python, Streamlit, Pandas, NumPy, Matplotlib, Seaborn, Jupyter Notebook.
- **Fitur**:
  - Analisis korelasi dan distribusi data transaksi nasabah kartu kredit (*Default of Credit Card Clients Dataset*).
  - Hasil proses Feature Engineering untuk model Deep Learning (seperti `total_bill`, `total_payment`, `debt_ratio`, `avg_delay`, dll.).
  - Dashboard interaktif berbasis Streamlit untuk menyajikan ringkasan EDA dan metrik model.
- **Lokasi Kode & Panduan**: Detail pengolahan data, instalasi dependensi, dan cara menjalankan dashboard visualisasi dapat ditemukan di **[DS/README.md]**.

---

## Komponen 2: AI (Credit Default Prediction API)

Modul **AI** bertugas sebagai mesin prediksi risiko (*prediction engine*) berbasis **Deep Learning** yang dideploy sebagai layanan REST API mandiri.

- **Teknologi**: Python, FastAPI, TensorFlow/Keras, Scikit-Learn, Google GenAI SDK.
- **Fitur**:
  - Prediksi probabilitas gagal bayar nasabah secara *real-time* berbasis data transaksi 3 bulan terakhir.
  - Integrasi dengan **Gemini AI** (`gemini-2.0-flash`) untuk memberikan rekomendasi finansial personal secara asinkron.
  - Penanganan data imbalance menggunakan pembobotan kelas (*class weights*) pada fase training model.
- **Lokasi Kode & Panduan**: Untuk petunjuk instalasi, aktivasi virtual environment (`.venv`), konfigurasi API Key Gemini, dan cara menjalankan server prediksi silakan buka **[AI/README.md]**.

---

## Komponen 3: FullStack (Aplikasi Dashboard)

Modul **FullStack** bertindak sebagai antarmuka pengguna (dashboard manajemen) yang memfasilitasi staf perbankan atau nasabah untuk melihat profil kredit, menginput data transaksi, dan memantau hasil analisis risiko gagal bayar serta saran finansial dari sistem.

- **Teknologi**: Javascript/HTML/CSS (Web Framework modern).
- **Fitur**:
  - Formulir input interaktif profil dan riwayat transaksi nasabah.
  - Tampilan visual tingkat risiko (*risk level*) dengan indikator warna (Rendah, Sedang, Tinggi).
  - Panel rekomendasi finansial dari Gemini AI terstruktur (Prioritas, Penting, Jangka Panjang).
- **Lokasi Kode & Panduan**: Untuk panduan instalasi dan menjalankan dashboard web silakan buka [README.md]

---

## Panduan Awal Memulai Proyek

Untuk memulai pengembangan atau menjalankan proyek ini di komputer lokal Anda:

1. **Kloning Repositori**:
   ```bash
   git clone <url-repositori-fincerdas>
   cd FinCerdas-Capstone-Project
   ```

2. **Jalankan Dashboard Streamlit (DS)**:
   Masuk ke folder `DS/Dashboard Streamlit`, install dependency, lalu jalankan Streamlit:
   ```bash
   cd DS/Dashboard Streamlit
   pip install -r requirements.txt
   streamlit run dashboard.py
   ```

3. **Jalankan Backend AI**:
   Masuk ke folder `AI`, siapkan environment variable `.env`, buat virtual environment, lalu jalankan FastAPI:
   ```bash
   cd ../../AI
   # Detail instalasi lengkap ada di AI/README.md
   ```

4. **Jalankan Aplikasi Dashboard (FullStack)**:
   Masuk ke folder `FullStack` dan ikuti panduan instalasi spesifik di dalam folder tersebut untuk menjalankan aplikasi client/dashboard.
   ```bash
   cd ../FullStack
   ```


---

## 🤝 Alur Integrasi Sistem

```mermaid
graph LR
    User[Pengguna] -->|Isi Data Finansial| Dashboard[Aplikasi FullStack]
    Dashboard -->|Kirim Request JSON| FastAPI[AI FastAPI Server]
    FastAPI -->|Preprocessing & Scale| Scaler[StandardScaler]
    Scaler -->|31 Fitur Hasil Transformasi| TFModel[Deep Learning Model Keras]
    TFModel -->|Prediksi Probabilitas Risiko| FastAPI
    FastAPI -->|Kirim Context Keuangan & Risiko| Gemini[Gemini AI API]
    Gemini -->|Generasi Saran Finansial Personal| FastAPI
    FastAPI -->|Response JSON Lengkap| Dashboard
    Dashboard -->|Tampilkan Hasil & Saran Finansial| User
```

Sistem dirancang agar berinteraksi secara asinkron dengan integrasi erat antara model Deep Learning lokal (untuk kecepatan dan efisiensi komputasi klasifikasi risiko) dan model Gemini AI LLM (untuk fleksibilitas penyusunan bahasa saran finansial yang personal).
