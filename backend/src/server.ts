import dotenv from 'dotenv';
dotenv.config({ path: ['.env.local','.env'] });

import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import bodyParser from 'body-parser';
import cors from 'cors';
import sequelize from './db';
import scanRoutes from './routes/scans';
import authRoutes from './routes/auth';
import healthRoutes from './routes/health';
import organizationsRoutes from './routes/organizations';
import checkpointsRoutes from './routes/checkpoints';
import patrollersRoutes from './routes/patrollers';

import {authenticateJWT} from "./routes/authMiddleware";


const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(bodyParser.json());

app.use('/health', healthRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/checkpoints', authenticateJWT, checkpointsRoutes);
app.use('/api/patrollers', authenticateJWT, patrollersRoutes);
app.use('/api', authenticateJWT, organizationsRoutes);

wss.on('connection', (ws) => {
    console.log('New client connected');
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

sequelize.sync().then(() => {
    server.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((err) => {
    console.error('Unable to connect to the database:', err);
});
