const crypto = require('crypto')

// Use environment variable or fallback for development
const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || 'your-32-character-secret-key-here!!'
const ALGORITHM = 'aes-256-cbc'

if (!process.env.ENCRYPTION_KEY) {
  console.warn(
    '⚠️  WARNING: Using default encryption key. Set ENCRYPTION_KEY environment variable in production!'
  )
}

/**
 * Encrypts a text string
 * @param {string} text - The text to encrypt
 * @returns {string} - Encrypted text in format: iv:encryptedData
 */
const encrypt = (text) => {
  if (!text) return text

  try {
    const iv = crypto.randomBytes(16)
    const key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest()
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    // Return iv and encrypted data separated by ':'
    return `${iv.toString('hex')}:${encrypted}`
  } catch (error) {
    console.error('❌ Encryption error:', error)
    throw new Error('Failed to encrypt data')
  }
}

/**
 * Decrypts an encrypted string
 * @param {string} encryptedText - The encrypted text in format: iv:encryptedData
 * @returns {string} - Decrypted text
 */
const decrypt = (encryptedText) => {
  if (!encryptedText) return encryptedText

  try {
    // Check if it's actually encrypted data
    if (!isEncrypted(encryptedText)) {
      return encryptedText
    }

    const [ivHex, encrypted] = encryptedText.split(':')
    const iv = Buffer.from(ivHex, 'hex')
    const key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest()
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)

    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  } catch (error) {
    console.error('❌ Decryption error:', error)
    // Return original text if decryption fails (for backward compatibility)
    return encryptedText
  }
}

/**
 * Checks if a string is encrypted (proper format validation)
 * @param {string} text - The text to check
 * @returns {boolean} - True if encrypted, false otherwise
 */
const isEncrypted = (text) => {
  if (!text || typeof text !== 'string') return false

  const parts = text.split(':')
  if (parts.length !== 2) return false

  const [ivHex, encrypted] = parts

  // IV should be 32 hex characters (16 bytes)
  if (!/^[0-9a-f]{32}$/i.test(ivHex)) return false

  // Encrypted data should be hex
  if (!/^[0-9a-f]+$/i.test(encrypted)) return false

  return true
}

/**
 * Creates a hash for searching encrypted fields
 * @param {string} text - The text to hash
 * @returns {string} - SHA256 hash
 */
const createHash = (text) => {
  if (!text) return text

  return crypto
    .createHash('sha256')
    .update(text + ENCRYPTION_KEY)
    .digest('hex')
}

module.exports = {
  encrypt,
  decrypt,
  createHash,
  isEncrypted,
}
