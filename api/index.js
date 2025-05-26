import app from '../index.js';


console.log('App is:', app);

export default function handler(req, res) {
  app(req, res);
}