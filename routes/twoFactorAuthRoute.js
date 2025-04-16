const express = require('express');
const router = express.Router();
const { enableTwoFactorAuth, verifyTwoFactorCode } = require('../controllers/twoFactorAuthController');
const { protect } = require('../middlewares/authMiddleware');

// Enable 2FA
router.post('/enable', protect, enableTwoFactorAuth);

// Verify 2FA code
router.post('/verify', protect, verifyTwoFactorCode);

module.exports = router; 