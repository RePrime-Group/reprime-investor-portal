// Password hashing using Web Crypto API (PBKDF2)
// Compatible with Deno Deploy / Supabase Edge Functions

const ITERATIONS = 100000
const KEY_LENGTH = 64
const SALT_LENGTH = 16

function arrayBufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

function hexToArrayBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16)
  }
  return bytes.buffer
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH))

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  )

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    key,
    KEY_LENGTH * 8
  )

  const saltHex = arrayBufferToHex(salt.buffer)
  const hashHex = arrayBufferToHex(derivedBits)

  return `${saltHex}:${hashHex}`
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    const [saltHex, hashHex] = storedHash.split(':')
    if (!saltHex || !hashHex) return false

    const salt = new Uint8Array(hexToArrayBuffer(saltHex))

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveBits']
    )

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: ITERATIONS,
        hash: 'SHA-256',
      },
      key,
      KEY_LENGTH * 8
    )

    const newHashHex = arrayBufferToHex(derivedBits)

    return hashHex === newHashHex
  } catch {
    return false
  }
}
