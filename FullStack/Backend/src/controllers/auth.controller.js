const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// REGISTER
const register = async (req, res) => {
  const { fullname, email, password, sex, education, marriage, age } = req.body;

  // validasi field wajib
  if (!fullname || !email || !password || !sex || !education || !marriage || !age) {
    return res.status(400).json({
      status: 'error',
      message: 'Semua field wajib diisi',
    });
  }

  // validasi format email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      status: 'error',
      message: 'Format email tidak valid',
    });
  }

  // validasi password minimal 8 karakter
  if (password.length < 8) {
    return res.status(400).json({
      status: 'error',
      message: 'Password minimal 8 karakter',
    });
  }

  // validasi sex (1=Male, 2=Female)
  if (![1, 2].includes(sex)) {
    return res.status(400).json({
      status: 'error',
      message: 'Sex harus 1 (Male) atau 2 (Female)',
    });
  }

  // validasi education (1=Graduate, 2=University, 3=High School, 4=Others)
  if (![1, 2, 3, 4].includes(education)) {
    return res.status(400).json({
      status: 'error',
      message: 'Education harus 1, 2, 3, atau 4',
    });
  }

  // validasi marriage (1=Married, 2=Single, 3=Others)
  if (![1, 2, 3].includes(marriage)) {
    return res.status(400).json({
      status: 'error',
      message: 'Marriage harus 1, 2, atau 3',
    });
  }

  // validasi age
  if (typeof age !== 'number' || age < 18 || age > 100) {
    return res.status(400).json({
      status: 'error',
      message: 'Umur harus antara 18 sampai 100',
    });
  }

  try {
    // cek email sudah terdaftar
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        status: 'error',
        message: 'Email sudah terdaftar',
      });
    }

    // hash password
    const password_hash = await bcrypt.hash(password, 10);

    // simpan user ke DB
    const result = await pool.query(
      `INSERT INTO users (fullname, email, password_hash, sex, education, marriage, age)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, fullname, email, sex, education, marriage, age, created_at`,
      [fullname, email, password_hash, sex, education, marriage, age]
    );

    const newUser = result.rows[0];

    return res.status(201).json({
      status: 'success',
      message: 'Registrasi berhasil',
      data: newUser,
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan server',
      detail: error.message,
    });
  }
};

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Email dan password wajib diisi',
    });
  }

  try {
    // cek user ada
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'Email atau password salah',
      });
    }

    const user = result.rows[0];

    // cek password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Email atau password salah',
      });
    }

    // buat JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      status: 'success',
      message: 'Login berhasil',
      token,
      data: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        sex: user.sex,
        education: user.education,
        marriage: user.marriage,
        age: user.age,
      },
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan server',
      detail: error.message,
    });
  }
};

module.exports = { register, login };
