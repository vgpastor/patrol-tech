const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const Scan = mongoose.model('Scan', new mongoose.Schema({
    qrCode: String,
    location: {
        latitude: Number,
        longitude: Number
    },
    timestamp: { type: Date, default: Date.now }
}));

mongoose.connect('mongodb://localhost:27017/security-patrol', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(cors());
app.use(bodyParser.json());

app.post('/api/scans', async (req, res) => {
    const scan = new Scan(req.body);
    await scan.save();

    // Broadcast the new scan data to all connected clients
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(scan));
        }
    });

    res.status(201).send(scan);
});

app.get('/api/scans', async (req, res) => {
    const scans = await Scan.find().sort('-timestamp');
    res.send(scans);
});

wss.on('connection', ws => {
    console.log('New client connected');
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
