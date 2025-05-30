import createApp from '../src/app.js';

const app = createApp();

export default function handler(req, res) {
  app(req, res); // forward request to Express app
}