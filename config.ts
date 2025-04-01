export const origin =
  typeof window !== 'undefined'
    ? window.origin
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

export const hostName =
  typeof window !== 'undefined'
    ? window.location.host
    : process.env.NEXT_PUBLIC_API_ORIGIN || 'localhost:3000';
