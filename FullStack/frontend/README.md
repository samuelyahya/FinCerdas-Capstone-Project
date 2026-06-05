# FinCerdas — Frontend

Aplikasi web untuk analisis risiko gagal bayar kartu kredit berbasis Machine Learning. Dibangun dengan React + Vite.

🔗 **Live Demo:** [https://anabilaa-xyz.github.io/fincerdas-frontend](https://anabilaa-xyz.github.io/fincerdas-frontend)

---

## Fitur

- 🔐 Autentikasi (Register & Login) dengan data demografis
- 📊 Dashboard utama dengan ringkasan fitur
- 📋 Form input data keuangan kartu kredit
- 🤖 Analisis risiko gagal bayar oleh model Machine Learning
- 📈 Tampilan hasil analisis dengan skor dan level risiko
- 💡 Rekomendasi keuangan personal (Prioritas, Penting, Jangka Panjang)
- 🔒 Protected routes — halaman tertentu hanya bisa diakses setelah login

---

## Teknologi

| Teknologi | Versi | Kegunaan |
|---|---|---|
| React | 19 | UI Framework |
| Vite | 8 | Build tool & dev server |
| React Router DOM | 7 | Client-side routing |
| Axios | 1.x | HTTP request ke backend |
| Lucide React | 1.x | Icon library |
| Tailwind CSS | 4 | Utility CSS |
| gh-pages | 6.x | Deploy ke GitHub Pages |

---

## Struktur Folder

```
frontend/
├── src/
│   ├── assets/           # Gambar dan file statis
│   ├── components/
│   │   └── ProtectedRoute.jsx   # Guard untuk halaman yang butuh login
│   ├── context/
│   │   └── AuthContext.jsx      # Global state autentikasi
│   ├── pages/
│   │   ├── LandingPage.jsx      # Halaman beranda
│   │   ├── Login.jsx            # Halaman login
│   │   ├── Register.jsx         # Halaman registrasi + data demografis
│   │   ├── Dashboard.jsx        # Dashboard utama
│   │   ├── InputData.jsx        # Form input data keuangan
│   │   ├── HasilAnalisis.jsx    # Hasil analisis risiko
│   │   └── Rekomendasi.jsx      # Rekomendasi keuangan
│   ├── styles/
│   │   ├── Auth.css
│   │   ├── Dashboard.css
│   │   ├── LandingPage.css
│   │   ├── InputData.css
│   │   ├── HasilAnalisis.css
│   │   └── Rekomendasi.css
│   ├── utils/
│   │   └── api.js               # Konfigurasi Axios + interceptor token
│   ├── App.jsx                  # Root component + routing
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── package.json
└── .env
```

---

## Cara Menjalankan Lokal

### Prasyarat
- Node.js versi 18 atau lebih baru
- npm

### Langkah-langkah

**1. Clone repository**
```bash
git clone https://github.com/deviiaulya/ProjectFintech.git
cd ProjectFintech/frontend
```

**2. Install dependencies**
```bash
npm install
```

**3. Buat file `.env`**
```bash
cp .env.example .env
```
Isi file `.env`:
```
VITE_API_URL=https://gregarious-art-production-cac2.up.railway.app/api
```

**4. Jalankan development server**
```bash
npm run dev
```

Buka browser dan akses:
```
http://localhost:5173
```

---

## Koneksi ke Backend

Frontend terhubung ke backend yang di-deploy di Railway:

```
https://gregarious-art-production-cac2.up.railway.app/api
```

Konfigurasi ada di `src/utils/api.js`. Token JWT disimpan di `localStorage` setelah login dan dikirim otomatis di setiap request melalui Axios interceptor.

### Endpoint yang digunakan

| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/auth/register` | Daftar akun baru |
| POST | `/auth/login` | Login |
| POST | `/predict` | Analisis risiko keuangan |

---

## Alur Aplikasi

```
Landing Page
    ↓
Register / Login
    ↓
Dashboard
    ↓
Input Data Keuangan
    ↓
Hasil Analisis (skor & level risiko)
    ↓
Rekomendasi Keuangan
```

---

## Deploy

### GitHub Pages
```bash
npm run build
npm run deploy
```

### Vercel
Push ke branch `main` — Vercel otomatis deploy ulang.

---

## Update dari Backend

Jika teman backend melakukan perubahan dan push ke repo utama:

```bash
cd ProjectFintech
git pull
cd frontend
npm run build
npm run deploy
```


