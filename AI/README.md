# 💳 Fintech Cerdas - Credit Default Prediction API

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)](https://tensorflow.org)
[![Gemini AI](https://img.shields.io/badge/Gemini%20AI-8E75C2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![Python](https://img.shields.io/badge/Python-3.13-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)

**Fintech Cerdas** adalah aplikasi backend berbasis **FastAPI** dan **Deep Learning (TensorFlow/Keras)** untuk memprediksi risiko gagal bayar (*credit default*) nasabah kartu kredit. Selain memprediksi probabilitas risiko secara akurat, sistem ini terintegrasi dengan **Gemini AI** (`gemini-2.0-flash`) untuk menghasilkan rekomendasi finansial personal dan tindakan pencegahan risiko yang spesifik berdasarkan profil keuangan masing-masing nasabah.

---

## 🚀 Fitur Utama

- **Prediksi Akurat & Imbalanced-Resistant**: Menggunakan arsitektur Deep Learning Keras yang dioptimalkan dengan pembobotan kelas (*class weights*) untuk menangani ketidakseimbangan data (*class imbalance*) secara optimal.
- **Rekomendasi Pintar Gemini AI**: Terintegrasi langsung dengan SDK `google-genai` untuk memberikan analisis deskriptif, preventif, dan edukatif yang disesuaikan secara otomatis berdasarkan profil keuangan nasabah.
- **Auto-Scale & Auto-Conversion Preprocessing**: Dilengkapi dengan pipeline transformasi data otomatis menggunakan `scikit-learn` (`scaler.joblib`) untuk menjamin konsistensi input model, serta konversi mata uang otomatis (IDR ke NTD).
- **FastAPI Endpoints**: Kinerja tinggi, mendukung operasi asinkron, dan otomatis menghasilkan dokumentasi interaktif (Swagger UI & Redoc).

---

## 🛠️ Tech Stack & Dependencies

- **Framework API**: FastAPI, Uvicorn, Pydantic v2
- **Deep Learning & ML**: TensorFlow 2.18+, Scikit-Learn 1.8+, Joblib
- **Generative AI**: Google GenAI SDK (`google-genai`)
- **Utilitas**: Python-Dotenv, Pandas, NumPy

---

## 📁 Struktur Proyek

```text
AI/
├── app.py                      # Backend API Utama (FastAPI)
├── notebook.ipynb              # Eksplorasi Data, Pelatihan Model & Prototyping
├── credit_default_model.keras   # Model TensorFlow (Deep Learning) Terlatih
├── scaler.joblib               # Scaler Preprocessing Fitur (StandardScaler)
├── feature_names.joblib        # List Nama Fitur yang Digunakan Model
├── dataset_credit_final.csv    # Dataset Utama (Data Kartu Kredit)
├── requirements.txt            # Dependensi Python
├── .env.example                # Contoh Konfigurasi Environment Variable
└── README.md                   # Dokumentasi Proyek (File ini)
```

---

## ⚙️ Panduan Instalasi & Persiapan

Ikuti langkah-langkah di bawah ini untuk mempersiapkan dan menjalankan proyek di komputer lokal kamu:

### 1. Masuk ke Direktori AI
Pastikan terminal Anda sudah berada di dalam folder `AI`:
```bash
cd AI
```

### 2. Konfigurasi Environment Variable
Salin berkas `.env.example` menjadi `.env` dan masukkan API Key Gemini Anda:
```bash
# macOS/Linux atau Git Bash
cp .env.example .env

# Windows (Command Prompt)
copy .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env
```

Buka file `.env` dan isi variabel berikut dengan API key milik Anda:
```env
GEMINI_API_KEY=AIzaSyYourActualGeminiAPIKeyHere
```

### 3. Buat dan Aktifkan Virtual Environment (venv)
Buat environment terisolasi agar dependensi tidak bentrok dengan library global sistem Anda.

* **macOS / Linux:**
  ```bash
  python3 -m venv .venv
  source .venv/bin/activate
  ```

* **Windows (PowerShell):**
  ```powershell
  python -m venv .venv
  .venv\Scripts\Activate.ps1
  ```

* **Windows (Command Prompt / CMD):**
  ```cmd
  python -m venv .venv
  .venv\Scripts\activate.bat
  ```

### 4. Upgrade Pip & Install Dependensi
Setelah venv aktif, upgrade pip ke versi terbaru lalu install seluruh dependensi yang diperlukan:
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

---

## 🏃‍♂️ Cara Menjalankan Server API

Pastikan virtual environment (`.venv`) Anda telah aktif sebelum menjalankan server.

### Metode 1: Menggunakan Perintah `uvicorn` (Disarankan)
Jika virtual environment Anda sudah aktif, Anda dapat langsung menjalankan server dengan perintah berikut:
```bash
uvicorn app:app --reload
```

### Metode 2: Menjalankan Langsung via Path Virtual Environment
Jika Anda tidak ingin mengaktifkan venv secara manual, Anda bisa memanggil python/uvicorn dari path virtual environment secara langsung:

* **macOS / Linux:**
  ```bash
  ./.venv/bin/python -m uvicorn app:app --reload
  ```

* **Windows:**
  ```powershell
  .venv\Scripts\python -m uvicorn app:app --reload
  ```

Setelah berhasil dijalankan, server akan aktif di alamat:
- **Dokumentasi Interaktif (Swagger UI)**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Base API URL**: [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## 🧠 Konversi Mata Uang & Feature Engineering

> [!IMPORTANT]
> **Skema Mata Uang Input (Rupiah/IDR):**
> Model pembelajaran mesin dilatih menggunakan dataset yang dikonversi ke NTD (New Taiwan Dollar). Namun, untuk kenyamanan penggunaan aplikasi di Indonesia, API ini dirancang agar menerima data dalam mata uang **Rupiah (IDR)**. 
> 
> Secara internal, API akan membagi input finansial (`limit_bal`, `bill_amt1-3`, dan `pay_amt1-3`) dengan faktor konversi **500.0** (asumsi `1 NTD = 500 IDR`) sebelum melakukan *feature engineering* dan memprediksi risiko gagal bayar.

API juga melakukan *feature engineering* dinamis pada saat request diterima, menghasilkan **31 fitur input** (14 fitur dasar + 17 fitur kalkulasi turunan seperti rasio penggunaan kredit, tren keterlambatan, rasio pembayaran terhadap tagihan, dll.) untuk dikirim ke model Deep Learning.

---

## 📡 Spesifikasi Endpoints API

### 1. Health Check
* **Endpoint**: `GET /`
* **Deskripsi**: Memastikan server aktif, model TensorFlow berhasil dimuat, dan koneksi Gemini AI telah terkonfigurasi.
* **Respon Sukses (`200 OK`)**:
  ```json
  {
    "status": "ok",
    "message": "Credit Default Prediction API berjalan",
    "model": "credit_default_model.keras",
    "features": 31,
    "gemini_enabled": true,
    "gemini_model": "gemini-2.0-flash"
  }
  ```

---

### 2. Prediksi Risiko Kredit & Rekomendasi Finansial
* **Endpoint**: `POST /predict`
* **Deskripsi**: Melakukan prediksi kemungkinan gagal bayar kartu kredit dan menghasilkan rekomendasi finansial terpersonalisasi dari Gemini AI.
* **Request Body (JSON)**:
  ```json
  {
    "limit_bal": 50000000,
    "sex": 2,
    "education": 1,
    "marriage": 2,
    "age": 28,
    "pay_1": -1,
    "pay_2": -1,
    "pay_3": -1,
    "bill_amt1": 1000000,
    "bill_amt2": 750000,
    "bill_amt3": 500000,
    "pay_amt1": 1000000,
    "pay_amt2": 750000,
    "pay_amt3": 500000
  }
  ```
  
  *Detail Field Request:*
  - `limit_bal`: Limit kartu kredit nasabah (dalam Rupiah).
  - `sex`: Jenis kelamin (1 = Laki-laki, 2 = Perempuan).
  - `education`: Tingkat pendidikan (1 = Pascasarjana, 2 = Universitas, 3 = SMA, 4 = Lainnya).
  - `marriage`: Status pernikahan (1 = Menikah, 2 = Lajang, 3 = Lainnya).
  - `age`: Usia nasabah (18 s.d. 100 tahun).
  - `pay_1` s.d. `pay_3`: Status pembayaran bulan ini (`pay_1`), bulan lalu (`pay_2`), dan 2 bulan lalu (`pay_3`). Nilai:
    - `-2` = Tidak ada penggunaan kartu
    - `-1` = Pembayaran lunas
    - `0` = Pembayaran minimum / revolving
    - `1` = Terlambat bayar 1 bulan
    - `2` = Terlambat bayar 2 bulan
    - `3` = Terlambat bayar 3 bulan atau lebih
  - `bill_amt1` s.d. `bill_amt3`: Jumlah tagihan dari bulan ini (`bill_amt1`) hingga 2 bulan lalu (`bill_amt3`) dalam Rupiah.
  - `pay_amt1` s.d. `pay_amt3`: Jumlah yang dibayarkan dari bulan ini (`pay_amt1`) hingga 2 bulan lalu (`pay_amt3`) dalam Rupiah.

* **Response Body (JSON)**:
  ```json
  {
    "probability": 0.2104,
    "prediction": 0,
    "risk_level": "LOW",
    "message": "Risiko rendah gagal bayar",
    "recommendations": {
      "prioritas": [
            "Pastikan pembayaran minimum dilakukan tepat waktu",
            "Review dan kurangi pengeluaran tidak penting",
            "Buat rencana pembayaran hutang secara terstruktur"
      ],
      "penting": [
            "Bayar lebih dari minimum payment setiap bulan",
            "Buat anggaran bulanan untuk mengontrol pengeluaran",
            "Hindari tarik tunai dari kartu kredit"
      ],
      "jangka_panjang": [
            "Pertahankan rasio utang di bawah 30% dari limit",
            "Bangun dana darurat setara 3-6 bulan pengeluaran",
            "Pertimbangkan konsolidasi utang jika memiliki beberapa kartu kredit"
      ]
    }
  }
  ```
  
---