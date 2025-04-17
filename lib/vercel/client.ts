import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_ACCESS_TOKEN,
});

export default vercel;
