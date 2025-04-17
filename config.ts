const isBrowser = typeof window !== 'undefined';
const isDev = process.env.NODE_ENV === 'development';

let host: string;

if (isBrowser) {
  host = window.location.host;
} else {
  const vercelUrl = !isDev && process.env.VERCEL_URL;
  host = vercelUrl ? vercelUrl : 'localhost:3000';
}

const protocol = isDev ? 'http' : 'https';
const origin = `${protocol}://${host}`;
const appUrl = 'https://www.doorman.cloud';
export default {
  isDev,
  isBrowser,
  host,
  origin,
  appUrl,
};
