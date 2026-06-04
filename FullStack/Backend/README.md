# Fintech Cerdas Backend API

Backend API untuk proyek Capstone Fintech Cerdas. API ini digunakan untuk menerima input data keuangan pengguna, memproses prediksi risiko gagal bayar, dan mengembalikan hasil berupa risk score, level risiko, faktor penyebab, serta rekomendasi keuangan.

## Tech Stack

- Node.js
- Express.js
- CORS
- dotenv
- Postman

## Struktur Folder

```text
src/
├── server.js
├── routes/
│   └── prediction.routes.js
├── controllers/
│   └── prediction.controller.js
└── services/
    └── recommendation.service.js
    