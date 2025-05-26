import app from '../src/index.js';


console.log('App is:', app);

export default function handler(req, res) {
  app(req, res);
}