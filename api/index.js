import { createApp } from '../src/appVercel.js';

export default async (req, res) => {
  const app = await createApp();
  app(req, res);
};