// lib/auth.js
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

// Use a secure secret key from your environment variables
const secretKey = process.env.JWT_SECRET_KEY;
// The key needs to be converted to a TextEncoder Uint8Array
const key = new TextEncoder().encode(secretKey); 

/**
 * Encrypts the user payload into a JWT.
 * @param {object} payload - The user data to store in the token (e.g., { userId: '123', email: 'user@example.com' })
 */
export async function encrypt(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1 day') // 1 day expiry
    .sign(key);
}

/**
 * Decrypts and verifies the JWT from the cookie.
 * @param {string} [session=''] - The JWT string from the cookie.
 * @returns {Promise<object | null>} The decrypted user payload or null if invalid/missing.
 */
export async function decrypt(session = '') {
  if (!session) return null;
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ['HS256'],
    });
    // The payload is the decrypted user object
    return payload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

/**
 * Helper to get the user payload directly in a Server Component or Route Handler.
 * @returns {Promise<object | null>} The current user session payload.
 */
export async function getSession() {
  const sessionCookie = cookies().get('auth_token')?.value;
  return decrypt(sessionCookie);
}