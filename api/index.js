import app from '../src/index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default function handler(req, res) {
  app(req, res);
}

console.log('App is:', app);
console.log('__dirname:', __dirname);
console.log('src exists:', fs.existsSync(path.join(__dirname, '../src/index.js')));