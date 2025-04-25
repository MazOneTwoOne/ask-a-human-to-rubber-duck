import { createApp } from '../src/app.js';

export default async (req, res) => {
  try {
    const app = await createApp();
    app(req, res);
  } catch (error) {
    console.error("Error in serverless function:", error);
    res.status(500).send("Internal Server Error");
  }
};