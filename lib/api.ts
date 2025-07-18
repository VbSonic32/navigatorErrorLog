// utils/api.ts
import jwt from 'jsonwebtoken';

// Simple in-memory cache
let tokenCache: TokenCache = {
  token: null,
  expiry: null,
};

/**
 * Generates a JWT token for API authentication
 * Uses in-memory caching to avoid generating a new token for each request
 */
export async function generateJWTToken(): Promise<string> {
  const now = Date.now();

  // Check if the token is already cached and valid
  if (tokenCache.token && tokenCache.expiry && tokenCache.expiry > now) {
    return tokenCache.token;
  }

  // Data to be encoded in the JWT
  const data = {
    iss: 'LOCAL AUTHORITY',
    aud: 'http://helios.psav.com',
  };

  // JWT secret key
  const secretKey = process.env.API_KEY_SALT || ''; // Ensure you keep this key secure

  // Options for the JWT token
  const options = {
    expiresIn: '1h', // Token will expire in 1 hour
  };

  try {
    // Generate JWT token
    const token = await jwt.sign(data, secretKey, options);

    // Cache the token and its expiry time
    tokenCache.token = token;
    tokenCache.expiry = now + 3600000; // 1 hour in milliseconds

    return token;
  } catch (error) {
    console.error('Error generating JWT token:', error);
    return '';
  }
}
