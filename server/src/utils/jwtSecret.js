const DEV_FALLBACK_SECRET = "insecure-dev-jwt-secret";
let cachedSecret = null;

export const getJwtSecret = () => {
  if (cachedSecret) {
    return cachedSecret;
  }

  const envSecret = process.env.JWT_SECRET?.trim();
  if (envSecret) {
    cachedSecret = envSecret;
    return cachedSecret;
  }

  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "[Auth] JWT_SECRET is missing. Using a fallback dev secret. Set JWT_SECRET in your .env to silence this warning."
    );
    cachedSecret = DEV_FALLBACK_SECRET;
    return cachedSecret;
  }

  throw new Error("JWT_SECRET must be defined. Set it in your environment before starting the server.");
};
