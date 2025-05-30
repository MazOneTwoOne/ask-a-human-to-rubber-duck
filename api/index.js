import createApp from '../src/app.js';
import serverless from 'serverless-http';

const app = createApp();
export default serverless(app);