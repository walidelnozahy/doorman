// Environment type definitions
type Environment = 'development' | 'production';

// Configuration interface
interface Config {
  isDev: boolean;
  isBrowser: boolean;
  host: string;
  origin: string;
  appUrl: string;
  rootHost: string;
  environment: Environment;
}

// Constants
const APP_URL = 'https://www.doorman.cloud';
const DEFAULT_HOST = 'localhost:3000';

// Environment detection
const isBrowser = typeof window !== 'undefined';
const environment = (process.env.NODE_ENV || 'development') as Environment;
const isDevEnv = environment === 'development';

// Host determination
const getHost = (): string => {
  if (isBrowser) {
    return window.location.host.replace('www.', '');
  }

  const vercelUrl = !isDevEnv && APP_URL;
  return vercelUrl ? vercelUrl.replace('www.', '') : DEFAULT_HOST;
};

const host = getHost();
const rootHost = host.replace('www.', '');
const origin = host;
const isDev = isDevEnv || host?.includes('vercel.app');

// Configuration object
const config: Config = {
  isDev,
  isBrowser,
  host,
  origin,
  appUrl: APP_URL,
  rootHost,
  environment,
};

export default config;
