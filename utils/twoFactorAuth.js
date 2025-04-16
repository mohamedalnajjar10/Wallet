const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// Generate a new 2FA secret
const generateSecret = () => {
  return speakeasy.generateSecret({
    name: 'Wallet App',
    length: 20
  });
};

// Generate QR code for the secret
const generateQRCode = async (secret) => {
  try {
    return await QRCode.toDataURL(secret.otpauth_url);
  } catch (error) {
    throw new Error('Failed to generate QR code');
  }
};

// Verify 2FA code
const verifyCode = (secret, token) => {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token
  });
};

// Generate backup codes
const generateBackupCodes = () => {
  const codes = [];
  for (let i = 0; i < 8; i++) {
    codes.push(Math.random().toString(36).substring(2, 8).toUpperCase());
  }
  return codes;
};

module.exports = {
  generateSecret,
  generateQRCode,
  verifyCode,
  generateBackupCodes
}; 
