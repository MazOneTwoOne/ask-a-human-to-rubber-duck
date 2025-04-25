import { createApp } from '../src/app.js';

export default async (req, res) => {
  const app = await createApp();
  app(req, res);
};
