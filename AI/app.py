"""
- GET  /           → Health check
- POST /predict    → Prediksi + rekomendasi
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import tensorflow as tf
import numpy as np
import pandas as pd
import joblib
import os
import json
from google import genai
from dotenv import load_dotenv

# Load environment variables dari file .env
load_dotenv()


# Custom Components
class CustomDenseBlock(tf.keras.layers.Layer):
    """
    Custom Dense Block: Dense → BatchNormalization → ReLU → Dropout
    """

    def __init__(self, units, dropout_rate=0.3, **kwargs):

        super().__init__(**kwargs)

        self.units = units
        self.dropout_rate = dropout_rate

    def build(self, input_shape):

        self.dense = tf.keras.layers.Dense(
            self.units,
            kernel_initializer='he_normal',
            kernel_regularizer=tf.keras.regularizers.l2(1e-4)
        )

        self.batch_norm = tf.keras.layers.BatchNormalization()

        self.activation = tf.keras.layers.ReLU()

        self.dropout = tf.keras.layers.Dropout(self.dropout_rate)

        super().build(input_shape)

    def call(self, inputs, training=False):

        x = self.dense(inputs)
        x = self.batch_norm(x, training=training)
        x = self.activation(x)
        x = self.dropout(x, training=training)

        return x

    def get_config(self):

        config = super().get_config()

        config.update({
            'units': self.units,
            'dropout_rate': self.dropout_rate,
        })

        return config

    @classmethod
    def from_config(cls, config):
        return cls(**config)



# Load model & scaler
model = tf.keras.models.load_model(
    'credit_default_model.keras',
    custom_objects={
        'CustomDenseBlock': CustomDenseBlock,
    }
)

scaler = joblib.load('scaler.joblib')
feature_names = joblib.load('feature_names.joblib')

print("✓ Model, scaler, and feature names loaded successfully")


# Gemini API Setup
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

if GEMINI_API_KEY:
    gemini_client = genai.Client(api_key=GEMINI_API_KEY)
    print(f"✓ Gemini API configured (Model: {GEMINI_MODEL})")
else:
    gemini_client = None
    print("⚠ GEMINI_API_KEY not set - recommendations will use fallback")


# Pydantic Schemas
class CreditInput(BaseModel):
    """Input schema untuk prediksi kredit."""

    limit_bal: float = Field(
        ...,
        description="Limit kredit (NT dollar)",
        examples=[50000.0]
    )

    sex: int = Field(
        ...,
        description="Jenis kelamin (1=laki-laki, 2=perempuan)",
        ge=1, le=2,
        examples=[1]
    )

    education: int = Field(
        ...,
        description="Pendidikan (1=pascasarjana, 2=universitas, 3=SMA, 4=lainnya)",
        ge=1, le=4,
        examples=[2]
    )

    marriage: int = Field(
        ...,
        description="Status pernikahan (1=menikah, 2=lajang, 3=lainnya)",
        ge=1, le=3,
        examples=[1]
    )

    age: int = Field(
        ...,
        description="Usia dalam tahun",
        ge=18, le=100,
        examples=[30]
    )

    pay_1: int = Field(
        ...,
        description="Status pembayaran bulan ini (-2=tidak ada konsumsi, -1=bayar lunas, 0=revolving, 1=delay 1 bulan, 2=delay 2 bulan, 3=delay 3+ bulan)",
        ge=-2, le=3,
        examples=[0]
    )

    pay_2: int = Field(
        ...,
        description="Status pembayaran bulan lalu",
        ge=-2, le=3,
        examples=[0]
    )

    pay_3: int = Field(
        ...,
        description="Status pembayaran 2 bulan lalu",
        ge=-2, le=3,
        examples=[0]
    )

    bill_amt1: float = Field(
        ...,
        description="Tagihan bulan ini (NT dollar)",
        examples=[10000.0]
    )

    bill_amt2: float = Field(
        ...,
        description="Tagihan bulan lalu (NT dollar)",
        examples=[9000.0]
    )

    bill_amt3: float = Field(
        ...,
        description="Tagihan 2 bulan lalu (NT dollar)",
        examples=[8000.0]
    )

    pay_amt1: float = Field(
        ...,
        description="Pembayaran bulan ini (NT dollar)",
        examples=[5000.0]
    )

    pay_amt2: float = Field(
        ...,
        description="Pembayaran bulan lalu (NT dollar)",
        examples=[4000.0]
    )

    pay_amt3: float = Field(
        ...,
        description="Pembayaran 2 bulan lalu (NT dollar)",
        examples=[3000.0]
    )

# Rekomendasi dari gemini
class Recommendations(BaseModel):
    prioritas: list[str] = Field(
        ...,
        description="Rekomendasi prioritas (urgent action)"
    )

    penting: list[str] = Field(
        ...,
        description="Rekomendasi penting (medium-term)"
    )

    jangka_panjang: list[str] = Field(
        ...,
        description="Rekomendasi jangka panjang (long-term habits)"
    )

# Response schema
class PredictionResponse(BaseModel):
    probability: float = Field(
        ...,
        description="Probabilitas gagal bayar (0-1)"
    )

    prediction: int = Field(
        ...,
        description="Prediksi (0=tidak gagal bayar, 1=gagal bayar)"
    )

    risk_level: str = Field(
        ...,
        description="Level risiko (LOW/MEDIUM/HIGH)"
    )

    message: str = Field(
        ...,
        description="Pesan prediksi"
    )

    recommendations: Recommendations = Field(
        ...,
        description="Rekomendasi dari Gemini AI"
    )


# Helper Functions
def engineer_features(data: CreditInput) -> np.ndarray:
    """
    Feature engineering dari input user.
    Menghasilkan array 31 features sesuai training.
    (14 base + 17 engineered)
    """

    total_bill = (
        data.bill_amt1
        + data.bill_amt2
        + data.bill_amt3
    )

    total_payment = (
        data.pay_amt1
        + data.pay_amt2
        + data.pay_amt3
    )

    debt_ratio = (
        total_bill / data.limit_bal
        if data.limit_bal != 0
        else 0.0
    )

    avg_delay = (
        (data.pay_1 + data.pay_2 + data.pay_3) / 3.0
    )

    payment_ratio = (
        total_payment / total_bill
        if total_bill != 0
        else 0.0
    )

    payment_to_limit_ratio = (
        total_payment / data.limit_bal
        if data.limit_bal != 0
        else 0.0
    )

    max_delay = max(data.pay_1, data.pay_2, data.pay_3)

    has_delay = 1 if max_delay > 0 else 0

    utilization_1 = (
        data.bill_amt1 / data.limit_bal
        if data.limit_bal != 0
        else 0.0
    )

    utilization_2 = (
        data.bill_amt2 / data.limit_bal
        if data.limit_bal != 0
        else 0.0
    )

    utilization_3 = (
        data.bill_amt3 / data.limit_bal
        if data.limit_bal != 0
        else 0.0
    )

    pay_bill_ratio_1 = (
        data.pay_amt1 / (abs(data.bill_amt1) + 1)
        if data.bill_amt1 != 0
        else 0.0
    )

    pay_bill_ratio_2 = (
        data.pay_amt2 / (abs(data.bill_amt2) + 1)
        if data.bill_amt2 != 0
        else 0.0
    )

    pay_bill_ratio_3 = (
        data.pay_amt3 / (abs(data.bill_amt3) + 1)
        if data.bill_amt3 != 0
        else 0.0
    )

    bill_growth = (
        (data.bill_amt1 - data.bill_amt3) / (abs(data.bill_amt3) + 1)
        if abs(data.bill_amt3) >= 1
        else 0.0
    )

    payment_growth = (
        (data.pay_amt1 - data.pay_amt3) / (abs(data.pay_amt3) + 1)
        if abs(data.pay_amt3) >= 1
        else 0.0
    )

    delay_trend = data.pay_1 - data.pay_3

    # Susun array sesuai urutan training (31 features)
    # Base: LIMIT_BAL, SEX, EDUCATION, MARRIAGE, AGE, PAY_1-3, BILL_AMT1-3, PAY_AMT1-3
    # Engineered: 17 fitur turunan
    features = [
        data.limit_bal,
        data.sex,
        data.education,
        data.marriage,
        data.age,
        data.pay_1,
        data.pay_2,
        data.pay_3,
        data.bill_amt1,
        data.bill_amt2,
        data.bill_amt3,
        data.pay_amt1,
        data.pay_amt2,
        data.pay_amt3,
        total_bill,
        total_payment,
        debt_ratio,
        avg_delay,
        payment_ratio,
        payment_to_limit_ratio,
        max_delay,
        has_delay,
        utilization_1,
        utilization_2,
        utilization_3,
        pay_bill_ratio_1,
        pay_bill_ratio_2,
        pay_bill_ratio_3,
        bill_growth,
        payment_growth,
        delay_trend,
    ]

    return np.array([features], dtype=np.float32)


def get_risk_level(probability: float) -> tuple[str, str]:
    """Tentukan risk level dan pesan."""

    if probability > 0.7:
        return "HIGH", "Berisiko tinggi gagal bayar"

    elif probability > 0.3:
        return "MEDIUM", "Risiko sedang gagal bayar"

    else:
        return "LOW", "Risiko rendah gagal bayar"


async def get_gemini_recommendations(
    data: CreditInput,
    probability: float,
    risk_level: str,
) -> dict:
    """
    Dapatkan rekomendasi dari Gemini AI berdasarkan
    data nasabah dan hasil prediksi.
    """

    if gemini_client is None:
        return get_fallback_recommendations(
            data, probability, risk_level
        )

    # Hitung metrics tambahan untuk context
    total_bill = (
        data.bill_amt1 + data.bill_amt2 + data.bill_amt3
    )
    total_payment = (
        data.pay_amt1 + data.pay_amt2 + data.pay_amt3
    )
    max_delay = max(data.pay_1, data.pay_2, data.pay_3)

    # Mapping untuk label demografis
    sex_label = "Laki-laki" if data.sex == 1 else "Perempuan"
    edu_map = {1: "Pascasarjana", 2: "Universitas", 3: "SMA", 4: "Lainnya"}
    edu_label = edu_map.get(data.education, "Tidak diketahui")
    marriage_map = {1: "Menikah", 2: "Lajang", 3: "Lainnya"}
    marriage_label = marriage_map.get(data.marriage, "Tidak diketahui")

    prompt = f"""Kamu adalah seorang financial advisor untuk nasabah kartu kredit.
Berdasarkan data berikut, berikan rekomendasi yang spesifik dan actionable.

DATA NASABAH:
- Jenis Kelamin: {sex_label}
- Pendidikan: {edu_label}
- Status Pernikahan: {marriage_label}
- Usia: {data.age} tahun
- Limit Kredit: Rp{data.limit_bal:,.0f}
- Status Pembayaran Bulan Ini: {data.pay_1} (negatif=baik, 0=revolving, positif=delay)
- Status Pembayaran Bulan Lalu: {data.pay_2}
- Status Pembayaran 2 Bulan Lalu: {data.pay_3}
- Tagihan Bulan Ini: Rp{data.bill_amt1:,.0f}
- Tagihan Bulan Lalu: Rp{data.bill_amt2:,.0f}
- Tagihan 2 Bulan Lalu: Rp{data.bill_amt3:,.0f}
- Pembayaran Bulan Ini: Rp{data.pay_amt1:,.0f}
- Pembayaran Bulan Lalu: Rp{data.pay_amt2:,.0f}
- Pembayaran 2 Bulan Lalu: Rp{data.pay_amt3:,.0f}
- Total Tagihan 3 Bulan: Rp{total_bill:,.0f}
- Total Pembayaran 3 Bulan: Rp{total_payment:,.0f}
- Keterlambatan Terlama: {max_delay} bulan

HASIL PREDIKSI:
- Probabilitas Gagal Bayar: {probability:.2%}
- Level Risiko: {risk_level}

Berikan rekomendasi dalam format JSON berikut (tanpa markdown, hanya JSON murni):
{{
    "prioritas": ["rekomendasi urgent 1", "rekomendasi urgent 2", "rekomendasi urgent 3"],
    "penting": ["rekomendasi penting 1", "rekomendasi penting 2", "rekomendasi penting 3"],
    "jangka_panjang": ["rekomendasi jangka panjang 1", "rekomendasi jangka panjang 2", "rekomendasi jangka panjang 3"]
}}

Aturan:
- Setiap kategori HARUS memiliki tepat 3 rekomendasi
- Rekomendasi harus spesifik berdasarkan data nasabah, bukan generik
- "prioritas": langkah yang harus dilakukan SEGERA (dalam 1 minggu)
- "penting": langkah yang harus dilakukan dalam 1-3 bulan
- "jangka_panjang": kebiasaan keuangan yang harus dibangun untuk 6+ bulan
- Gunakan bahasa Indonesia yang jelas dan profesional
- Sebutkan angka spesifik berdasarkan data nasabah jika relevan"""

    try:
        response = gemini_client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
        )

        # Parse JSON dari response
        response_text = response.text.strip()

        # Hapus markdown code block jika ada
        if response_text.startswith('```'):
            lines = response_text.split('\n')
            response_text = '\n'.join(lines[1:-1])

        recommendations = json.loads(response_text)

        # Validasi structure
        for key in ['prioritas', 'penting', 'jangka_panjang']:
            if key not in recommendations:
                raise ValueError(f"Missing key: {key}")
            if not isinstance(recommendations[key], list):
                raise ValueError(f"{key} is not a list")

        return recommendations

    except Exception as e:
        print(f"Gemini API error: {e}")
        return get_fallback_recommendations(
            data, probability, risk_level
        )


def get_fallback_recommendations(
    data: CreditInput,
    probability: float,
    risk_level: str,
) -> dict:
    """
    Fallback rekomendasi jika Gemini API tidak tersedia.
    Rule-based berdasarkan data nasabah.
    """

    max_delay = max(data.pay_1, data.pay_2, data.pay_3)
    total_bill = (
        data.bill_amt1 + data.bill_amt2 + data.bill_amt3
    )
    total_payment = (
        data.pay_amt1 + data.pay_amt2 + data.pay_amt3
    )

    prioritas = []
    penting = []
    jangka_panjang = []

    # Prioritas
    if max_delay >= 2:
        prioritas.append(
            "Segera lunasi tunggakan pembayaran yang "
            f"tertunda {max_delay} bulan"
        )
    if probability > 0.7:
        prioritas.append(
            "Hubungi bank untuk negosiasi "
            "restrukturisasi kredit"
        )
    if total_payment < total_bill * 0.1:
        prioritas.append(
            "Alokasikan minimal 30% pendapatan "
            "untuk pembayaran hutang"
        )

    if len(prioritas) < 3:
        defaults_prioritas = [
            "Pastikan pembayaran minimum dilakukan tepat waktu",
            "Review dan kurangi pengeluaran tidak penting",
            "Buat rencana pembayaran hutang secara terstruktur",
        ]
        for r in defaults_prioritas:
            if len(prioritas) >= 3:
                break
            if r not in prioritas:
                prioritas.append(r)

    # Penting
    if total_bill > data.limit_bal * 0.5:
        penting.append(
            "Kurangi penggunaan kartu kredit - "
            f"utilisasi saat ini {total_bill/data.limit_bal*100:.0f}%"
            if data.limit_bal > 0 else
            "Kurangi penggunaan kartu kredit"
        )
    penting.append(
        "Bayar lebih dari minimum payment setiap bulan"
    )
    penting.append(
        "Buat anggaran bulanan untuk mengontrol pengeluaran"
    )

    if len(penting) < 3:
        penting.append(
            "Hindari tarik tunai dari kartu kredit"
        )

    # Jangka panjang
    jangka_panjang = [
        "Pertahankan rasio utang di bawah 30% dari limit",
        "Bangun dana darurat setara 3-6 bulan pengeluaran",
        "Pertimbangkan konsolidasi utang jika memiliki "
        "beberapa kartu kredit",
    ]

    return {
        'prioritas': prioritas[:3],
        'penting': penting[:3],
        'jangka_panjang': jangka_panjang[:3],
    }


# FastAPI App
app = FastAPI(
    title="Credit Default Prediction API",
    description=(
        "API untuk prediksi risiko gagal bayar kartu kredit "
        "menggunakan TensorFlow Deep Learning model "
        "dengan rekomendasi dari Gemini AI."
    ),
    version="1.0.0",
)


@app.get('/')
def home():
    """Health check endpoint."""

    return {
        'status': 'ok',
        'message': 'Credit Default Prediction API berjalan',
        'model': 'credit_default_model.keras',
        'features': 31,
        'gemini_enabled': gemini_client is not None,
        'gemini_model': GEMINI_MODEL if gemini_client is not None else None,
    }


@app.post(
    '/predict',
    response_model=PredictionResponse
)
async def predict(data: CreditInput):
    """
    Prediksi risiko gagal bayar kartu kredit.

    Input: data finansial 3 bulan terakhir.
    Output: probabilitas, prediksi, risk level, rekomendasi.
    """

    try:
        # Create a copy of the data and convert Rupiah to NTD for the ML Model
        # This keeps the original data intact for Gemini prompt
        model_data = data.model_copy()
        CONVERSION_RATE = 500.0
        
        model_data.limit_bal /= CONVERSION_RATE
        model_data.bill_amt1 /= CONVERSION_RATE
        model_data.bill_amt2 /= CONVERSION_RATE
        model_data.bill_amt3 /= CONVERSION_RATE
        model_data.pay_amt1 /= CONVERSION_RATE
        model_data.pay_amt2 /= CONVERSION_RATE
        model_data.pay_amt3 /= CONVERSION_RATE

        # Feature engineering using scaled NTD data
        features = engineer_features(model_data)

        # Handle infinity/NaN
        features = np.nan_to_num(
            features,
            nan=0.0,
            posinf=0.0,
            neginf=0.0
        )

        # Scale features using DataFrame with matching feature names to avoid warnings
        features_df = pd.DataFrame(features, columns=feature_names)
        features_scaled = scaler.transform(features_df)

        # Predict
        prediction_proba = model.predict(
            features_scaled,
            verbose=0
        )

        probability = float(prediction_proba[0][0])

        # Custom threshold untuk menekan False Positives
        # pada data test yang imbalanced
        OPTIMAL_THRESHOLD = 0.50
        prediction = 1 if probability >= OPTIMAL_THRESHOLD else 0

        risk_level, message = get_risk_level(probability)

        # Get recommendations from Gemini
        recommendations = await get_gemini_recommendations(
            data, probability, risk_level
        )

        return PredictionResponse(
            probability=round(probability, 4),
            prediction=prediction,
            risk_level=risk_level,
            message=message,
            recommendations=Recommendations(
                **recommendations
            ),
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction error: {str(e)}"
        )
