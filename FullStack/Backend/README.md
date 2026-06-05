Fintech Cerdas Backend API
Backend RESTful API untuk proyek Capstone Fintech Cerdas yang berfungsi sebagai jembatan antara frontend dan model Machine Learning. API ini menangani autentikasi pengguna, memproses prediksi risiko gagal bayar kartu kredit, serta menyimpan riwayat hasil analisis ke database.

🚀 Tech Stack
Node.js
Express.js
PostgreSQL (Supabase)
JSON Web Token (JWT)
Bcryptjs
Axios
CORS
dotenv
📂 Struktur Folder
src/
├── server.js
├── config/
│   └── db.js
├── middleware/
│   └── auth.middleware.js
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── prediction.routes.js
│   └── analyses.routes.js
├── controllers/
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── prediction.controller.js
│   └── analyses.controller.js
└── services/
    └── ml.service.js
⚙️ Instalasi
Clone repository terlebih dahulu:

git clone https://github.com/deviiaulya/ProjectFintech.git
Masuk ke folder backend:

cd ProjectFintech/Backend
Install seluruh dependency:

npm install
🔐 Environment Variables
Buat file .env pada root project dan tambahkan konfigurasi berikut:

PORT=5000

ML_API_URL=https://web-production-92448.up.railway.app

DATABASE_URL=postgresql://postgres.[project]:[password]@[host]:5432/postgres

JWT_SECRET=your_jwt_secret_key
▶️ Menjalankan Server
Jalankan server dengan perintah:

npm run start
Server akan berjalan pada:

http://localhost:5000
🌐 API Base URL
https://gregarious-art-production-cac2.up.railway.app
📌 API Endpoints
Method	Endpoint	Deskripsi
POST	/api/auth/register	Registrasi pengguna baru
POST	/api/auth/login	Login dan mendapatkan token JWT
GET	/api/user/profile	Mendapatkan data profil pengguna
POST	/api/predict	Melakukan prediksi risiko gagal bayar kartu kredit
GET	/api/analyses/history	Mendapatkan riwayat analisis pengguna
GET	/api/analyses/:id	Mendapatkan detail analisis berdasarkan ID
🔄 Alur Sistem
Pengguna melakukan registrasi atau login.
Backend memvalidasi data pengguna dan menghasilkan token JWT.
Pengguna mengirimkan data kartu kredit melalui endpoint prediksi.
Backend meneruskan data ke layanan Machine Learning menggunakan Axios.
Model Machine Learning mengembalikan hasil prediksi risiko.
Hasil prediksi disimpan ke database PostgreSQL.
Pengguna dapat melihat riwayat dan detail analisis yang telah dilakukan.
🚢 Deployment
Backend API
Platform: Railway
URL: https://gregarious-art-production-cac2.up.railway.app
Database
Platform: Supabase
Database: PostgreSQL
👨‍💻 Tim Pengembang
Proyek ini dikembangkan sebagai bagian dari Capstone Project Fintech Cerdas, yang bertujuan membantu pengguna memahami tingkat risiko gagal bayar kartu kredit melalui analisis berbasis Machine Learning.

