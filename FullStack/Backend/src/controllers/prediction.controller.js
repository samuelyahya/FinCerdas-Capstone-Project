const { predictFromML } = require('../services/ml.service');
const pool = require('../config/db');

const predictRisk = async (req, res) => {
  const inputData = req.body;

  // validasi field wajib (tanpa sex, education, marriage, age
  // karena diambil dari data user yang login)
  const requiredFields = [
    'limit_bal',
    'pay_1', 'pay_2', 'pay_3',
    'bill_amt1', 'bill_amt2', 'bill_amt3',
    'pay_amt1', 'pay_amt2', 'pay_amt3',
  ];

  const missingFields = requiredFields.filter(
    (field) => inputData[field] === undefined || inputData[field] === ''
  );

  if (missingFields.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Data input belum lengkap',
      missing_fields: missingFields,
    });
  }

  const {
    limit_bal,
    pay_1, pay_2, pay_3,
    bill_amt1, bill_amt2, bill_amt3,
    pay_amt1, pay_amt2, pay_amt3,
  } = inputData;

  // validasi limit kredit
  if (typeof limit_bal !== 'number' || limit_bal <= 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Limit kredit harus berupa angka dan lebih dari 0',
    });
  }

  // validasi tagihan
  if (![bill_amt1, bill_amt2, bill_amt3].every((b) => typeof b === 'number')) {
    return res.status(400).json({
      status: 'error',
      message: 'Semua data tagihan harus berupa angka',
    });
  }

  // validasi pembayaran
  if (![pay_amt1, pay_amt2, pay_amt3].every((p) => typeof p === 'number' && p >= 0)) {
    return res.status(400).json({
      status: 'error',
      message: 'Semua data pembayaran harus berupa angka dan tidak boleh negatif',
    });
  }

  // validasi status pembayaran
  if (![pay_1, pay_2, pay_3].every((s) => typeof s === 'number' && s >= -2 && s <= 8)) {
    return res.status(400).json({
      status: 'error',
      message: 'Status pembayaran harus berupa angka antara -2 sampai 8',
    });
  }

  try {
    // ambil data demografis dari user yang sedang login
    const userResult = await pool.query(
      'SELECT sex, education, marriage, age FROM users WHERE id = $1',
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'User tidak ditemukan',
      });
    }

    const { sex, education, marriage, age } = userResult.rows[0];

    // kirim ke FastAPI 
    const payload = {
      limit_bal,
      sex,
      education,
      marriage,
      age,
      pay_1, pay_2, pay_3,
      bill_amt1, bill_amt2, bill_amt3,
      pay_amt1, pay_amt2, pay_amt3,
    };

    const mlResult = await predictFromML(payload);

    // simpan hasil analisis ke DB
    await pool.query(
      `INSERT INTO analyses
        (user_id, limit_bal,
        pay_1, pay_2, pay_3,
        bill_amt1, bill_amt2, bill_amt3,
        pay_amt1, pay_amt2, pay_amt3,
        probability, prediction, risk_level, recommendations)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
      [
        req.user.id,
        limit_bal,
        pay_1, pay_2, pay_3,
        bill_amt1, bill_amt2, bill_amt3,
        pay_amt1, pay_amt2, pay_amt3,
        mlResult.probability,
        mlResult.prediction,
        mlResult.risk_level,
        JSON.stringify(mlResult.recommendations),
      ]
    );

    return res.status(200).json({
      status: 'success',
      message: 'Prediksi berhasil diproses',
      data: mlResult,
    });

  } catch (error) {
    return res.status(502).json({
      status: 'error',
      message: 'Gagal terhubung ke ML service',
      detail: error.message,
    });
  }
};

module.exports = { predictRisk };
