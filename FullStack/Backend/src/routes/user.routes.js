const express = require('express');
const { getProfile } = require('../controllers/user.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/profile', authenticateToken, getProfile);

module.exports = router;
