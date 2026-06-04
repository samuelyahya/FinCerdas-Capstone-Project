const express = require('express');
const { predictRisk } = require('../controllers/prediction.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/predict', authenticateToken, predictRisk);

module.exports = router;
