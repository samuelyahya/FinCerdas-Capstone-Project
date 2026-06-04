const pool = require('../config/db');

// GET semua history analisis user
const getHistory = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, limit_bal, probability, prediction, risk_level, created_at
       FROM analyses
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    return res.status(200).json({
      status: 'success',
      total: result.rows.length,
      data: result.rows,
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan server',
      detail: error.message,
    });
  }
};

// GET detail satu analisis
const getDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT * FROM analyses
       WHERE id = $1 AND user_id = $2`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Data analisis tidak ditemukan',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: result.rows[0],
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan server',
      detail: error.message,
    });
  }
};

module.exports = { getHistory, getDetail };
