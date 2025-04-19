const isBrowser = typeof window !== 'undefined';
const isDev = process.env.NODE_ENV === 'development';
const appUrl = 'https://www.doorman.cloud';

let host: string;

if (isBrowser) {
  host = window.location.host.replace('www.', '');
} else {
  const vercelUrl = !isDev && appUrl;
  host = vercelUrl ? vercelUrl.replace('www.', '') : 'localhost:3000';
}

const protocol = isDev ? 'http' : 'https';
const origin = `${protocol}://${host}`;
export default {
  isDev,
  isBrowser,
  host,
  origin,
  appUrl,
};
