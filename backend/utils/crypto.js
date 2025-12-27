const crypto = require('crypto');

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY || 'your-32-character-secret-key-here!!!', 'utf8').slice(0, 32);
const ALGORITHM = 'aes-256-cbc';

function encryptPrivateKey(privateKey) {
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(privateKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    return privateKey; // Return original if encryption fails
  }
}

function decryptPrivateKey(encryptedPrivateKey) {
  try {
    if (!encryptedPrivateKey.includes(':')) {
      return encryptedPrivateKey; // Return as-is if not encrypted
    }
    
    const parts = encryptedPrivateKey.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedPrivateKey; // Return original if decryption fails
  }
}

module.exports = { encryptPrivateKey, decryptPrivateKey };