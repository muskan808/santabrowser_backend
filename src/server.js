import http from 'http';
import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { initSocketServer } from './socket.js';

await connectDB();
const httpServer = http.createServer(app);
initSocketServer(httpServer);
httpServer.listen(env.port, () => console.log(`API running on http://localhost:${env.port}`));
