function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === 'production') throw new Error('JWT_SECRET is required in production');
  return 'dev-only-secret-change-me';
}

function getClientOrigins() {
  const raw = process.env.CLIENT_URL || 'http://localhost:5173';
  const configuredOrigins = raw.split(',').map((s) => s.trim()).filter(Boolean);

  // Vite selects the next available development port when 5173 is occupied.
  // Keep local development usable without widening the production CORS policy.
  if (process.env.NODE_ENV !== 'production') {
    const localOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://127.0.0.1:5175',
    ];
    return [...new Set([...configuredOrigins, ...localOrigins])];
  }

  return configuredOrigins;
}

module.exports = {
  getJwtSecret,
  getClientOrigins,
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
};
