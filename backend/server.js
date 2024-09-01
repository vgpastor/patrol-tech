const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./db');
const Scan = require('./models/Scan');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(bodyParser.json());

app.post('/api/scans', async (req, res) => {
    try {
        const scan = await Scan.create(req.body);

        // Broadcast the new scan data to all connected clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(scan));
            }
        });

        res.status(201).send(scan);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/api/scans', async (req, res) => {
    try {
        const scans = await Scan.findAll({ order: [['timestamp', 'DESC']] });
        res.send(scans);
    } catch (error) {
        res.status(500).send(error);
    }
});

wss.on('connection', ws => {
    console.log('New client connected');
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

sequelize.sync().then(() => {
    server.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});
