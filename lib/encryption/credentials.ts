import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12   // 96 bits - aanbevolen voor GCM
const TAG_LENGTH = 16  // 128 bits - GCM auth tag

function getKey(): Buffer {
  const secret = process.env.ENCRYPTION_SECRET
  if (!secret) {
    throw new Error('ENCRYPTION_SECRET environment variable is niet ingesteld')
  }
  if (secret.length !== 64) {
    throw new Error('ENCRYPTION_SECRET moet 64 hex tekens zijn (32 bytes)')
  }
  return Buffer.from(secret, 'hex')
}

export function encrypt(plaintext: string): { ciphertext: string; iv: string } {
  const key = getKey()
  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipheriv(ALGORITHM, key, iv)

  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ])
  const authTag = cipher.getAuthTag()

  // Auth tag achter de ciphertext plakken
  const ciphertextWithTag = Buffer.concat([encrypted, authTag])

  return {
    ciphertext: ciphertextWithTag.toString('base64'),
    iv: iv.toString('base64'),
  }
}

export function decrypt(ciphertext: string, iv: string): string {
  const key = getKey()
  const ivBuffer = Buffer.from(iv, 'base64')
  const ciphertextBuffer = Buffer.from(ciphertext, 'base64')

  // Laatste 16 bytes zijn de auth tag
  const authTag = ciphertextBuffer.subarray(ciphertextBuffer.length - TAG_LENGTH)
  const encrypted = ciphertextBuffer.subarray(0, ciphertextBuffer.length - TAG_LENGTH)

  const decipher = createDecipheriv(ALGORITHM, key, ivBuffer)
  decipher.setAuthTag(authTag)

  return decipher.update(encrypted).toString('utf8') + decipher.final('utf8')
}
