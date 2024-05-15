const express = require('express');
const router = express.Router();
const Scan = require('../models/Scan');

router.post('/', (req, res) => {
    const scanData = new Scan(req.body);
    scanData.save((err) => {
        if (err) return res.status(500).send(err);
        res.status(200).send('Scan data saved successfully');
    });
});

router.get('/', (req, res) => {
    Scan.find({}, (err, scans) => {
        if (err) return res.status(500).send(err);
        res.status(200).json(scans);
    });
});

module.exports = router;
