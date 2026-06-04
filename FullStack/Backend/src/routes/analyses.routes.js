const express = require('express');
const { getHistory, getDetail } = require('../controllers/analyses.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/history', authenticateToken, getHistory);
router.get('/:id', authenticateToken, getDetail);

module.exports = router;
