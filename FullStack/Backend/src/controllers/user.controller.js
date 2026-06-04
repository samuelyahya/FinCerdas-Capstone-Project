const pool = require('../config/db');

const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, fullname, email, sex, education, marriage, age, created_at
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'User tidak ditemukan',
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

module.exports = { getProfile };
