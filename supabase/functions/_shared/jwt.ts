const JWT_SECRET = Deno.env.get('JWT_SECRET') || 'fallback-secret-change-me'

export interface JWTPayload {
  sub: string
  email: string
  name: string
  is_admin: boolean
  exp: number
  iat: number
}

function base64UrlEncode(str: string): string {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function base64UrlEncodeBytes(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return base64UrlEncode(binary)
}

export async function createJWT(payload: Omit<JWTPayload, 'exp' | 'iat'>): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const fullPayload: JWTPayload = {
    ...payload,
    iat: now,
    exp: now + (24 * 60 * 60), // 24 hours
  }

  const header = { alg: 'HS256', typ: 'JWT' }
  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload))

  const data = `${encodedHeader}.${encodedPayload}`

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(JWT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
  const encodedSignature = base64UrlEncodeBytes(new Uint8Array(signature))

  return `${data}.${encodedSignature}`
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const [encodedHeader, encodedPayload, encodedSignature] = parts
    const data = `${encodedHeader}.${encodedPayload}`

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(JWT_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )

    // Decode signature
    const signatureStr = encodedSignature
      .replace(/-/g, '+')
      .replace(/_/g, '/')
    const padding = '='.repeat((4 - signatureStr.length % 4) % 4)
    const signatureBinary = atob(signatureStr + padding)
    const signatureBytes = new Uint8Array(signatureBinary.length)
    for (let i = 0; i < signatureBinary.length; i++) {
      signatureBytes[i] = signatureBinary.charCodeAt(i)
    }

    const valid = await crypto.subtle.verify('HMAC', key, signatureBytes, new TextEncoder().encode(data))
    if (!valid) return null

    // Decode payload
    const payloadStr = encodedPayload
      .replace(/-/g, '+')
      .replace(/_/g, '/')
    const payloadPadding = '='.repeat((4 - payloadStr.length % 4) % 4)
    const payload = JSON.parse(atob(payloadStr + payloadPadding)) as JWTPayload

    // Check expiration
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp < now) return null

    return payload
  } catch {
    return null
  }
}
