import { createApp } from '../src/app.js';

const handlerPromise = createApp();

export default async function handler(req, res) {
  try {
    const handler = await handlerPromise;
    return handler(req, res);
  } catch (err) {
    console.error('Handler error:', err);
    res.status(500).send('Internal Server Error');
  }
}