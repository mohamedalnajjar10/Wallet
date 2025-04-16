const User = require('../models/userModel');
const { generateSecret, generateQRCode, verifyCode, generateBackupCodes } = require('../utils/twoFactorAuth');
const ApiError = require('../utils/ApiError');

// Enable 2FA for a user
exports.enableTwoFactorAuth = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return next(new ApiError('User not found', 404));
    }

    if (user.twoFactorEnabled) {
      return next(new ApiError('2FA is already enabled', 400));
    }

    // Generate new 2FA secret
    const secret = generateSecret();
    const backupCodes = generateBackupCodes();

    // Generate QR code
    const qrCode = await generateQRCode(secret);

    // Update user with 2FA details
    await user.update({
      twoFactorSecret: secret.base32,
      twoFactorBackupCodes: backupCodes,
      twoFactorEnabled: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        qrCode,
        backupCodes,
        message: 'Please scan the QR code with your authenticator app and save the backup codes in a secure place'
      }
    });
  } catch (error) {
    next(new ApiError(error.message, 500));
  }
};

// Verify 2FA code
exports.verifyTwoFactorCode = async (req, res, next) => {
  try {
    const { code } = req.body;
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return next(new ApiError('User not found', 404));
    }

    if (!user.twoFactorEnabled) {
      return next(new ApiError('2FA is not enabled', 400));
    }

    // Check if the code is a backup code
    const isBackupCode = user.twoFactorBackupCodes.includes(code);
    let isValid = false;

    if (isBackupCode) {
      // Remove the used backup code
      const updatedBackupCodes = user.twoFactorBackupCodes.filter(backupCode => backupCode !== code);
      await user.update({ twoFactorBackupCodes: updatedBackupCodes });
      isValid = true;
    } else {
      // Verify the TOTP code
      isValid = verifyCode(user.twoFactorSecret, code);
    }

    if (!isValid) {
      return next(new ApiError('Invalid verification code', 400));
    }

    res.status(200).json({
      status: 'success',
      message: '2FA verification successful'
    });
  } catch (error) {
    next(new ApiError(error.message, 500));
  }
}; 