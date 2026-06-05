# Data Science - FinCerdas

## Overview

Folder **DS (Data Science)** berisi seluruh proses analisis data yang dilakukan pada proyek **FinCerdas**, mulai dari data wrangling, exploratory data analysis (EDA), feature engineering, hingga pembuatan dashboard interaktif menggunakan Streamlit.

Tujuan utama analisis ini adalah mengidentifikasi faktor-faktor yang memengaruhi risiko gagal bayar kartu kredit serta menyediakan insight yang mendukung pengembangan model prediksi risiko gagal bayar.

---

## Project Structure

```text
DS
│
├── Dashboard Streamlit
│   ├── dashboard.py
│   ├── requirements.txt
│   ├── url.txt
│   └── data
│       ├── credit_baseline.csv
│       └── credit_final.csv
│
├── Notebook
│   └── DataScience_Capstone.ipynb
│
└── README.md
```

### Folder Description

| File / Folder                | Description                                                                                              |
| ---------------------------- | -------------------------------------------------------------------------------------------------------- |
| `dashboard.py`               | Source code dashboard Streamlit yang digunakan untuk menampilkan hasil analisis data dan evaluasi model. |
| `requirements.txt`           | Daftar dependency yang diperlukan untuk menjalankan dashboard.                                           |
| `url.txt`                    | Berisi URL deployment dashboard Streamlit.                                                               |
| `credit_baseline.csv`        | Dataset hasil preprocessing yang masih menggunakan fitur asli.                                           |
| `credit_final.csv`           | Dataset hasil feature engineering yang digunakan pada tahap pemodelan.                                   |
| `DataScience_Capstone.ipynb` | Notebook yang berisi proses data wrangling, EDA, feature engineering, dan evaluasi model.                |

---

## Dataset

Dataset yang digunakan adalah **Default of Credit Card Clients Dataset** yang berisi informasi terkait:

- Limit kredit pengguna
- Riwayat pembayaran
- Jumlah tagihan bulanan
- Jumlah pembayaran bulanan
- Status gagal bayar (default)

Dataset digunakan untuk menganalisis faktor-faktor yang memengaruhi risiko gagal bayar pengguna kartu kredit.

---

## Exploratory Data Analysis (EDA)

Analisis data dilakukan untuk menjawab beberapa pertanyaan bisnis:

1. Faktor apa saja yang paling memengaruhi risiko gagal bayar pengguna?
2. Bagaimana hubungan antara rasio utang dan keterlambatan pembayaran terhadap risiko gagal bayar?
3. Model machine learning apa yang memiliki performa terbaik dalam mendeteksi risiko gagal bayar?

---

## Feature Engineering

Beberapa fitur baru dibuat untuk merepresentasikan kondisi finansial pengguna secara lebih ringkas:

| Feature         | Description                               |
| --------------- | ----------------------------------------- |
| `total_bill`    | Total tagihan selama 3 bulan terakhir     |
| `total_payment` | Total pembayaran selama 3 bulan terakhir  |
| `debt_ratio`    | Rasio total tagihan terhadap limit kredit |
| `avg_delay`     | Rata-rata keterlambatan pembayaran        |
| `payment_ratio` | Rasio pembayaran terhadap total tagihan   |

Selain itu dilakukan:

- Penyederhanaan histori pembayaran menjadi 3 bulan terakhir untuk mendukung kebutuhan implementasi sistem

---

## Dashboard

Dashboard Streamlit dikembangkan untuk menampilkan:

- Ringkasan dataset
- Hasil Exploratory Data Analysis (EDA)
- Analisis feature engineering
- Evaluasi model

## Installation

Install dependency terlebih dahulu:

```bash
pip install -r requirements.txt
```

Dashboard dapat dijalankan secara lokal menggunakan perintah:

```bash
streamlit run dashboard.py
```

---

## Deployment

URL dashboard dapat ditemukan pada file:

```text
Dashboard Streamlit/url.txt
```

---

## Authors

Data Science Team – FinCerdas

Coding Camp by DBS Foundation 2026
