const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
    qrCode: String,
    location: {
        latitude: Number,
        longitude: Number
    },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Scan', scanSchema);
