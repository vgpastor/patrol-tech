import express, { Request, Response } from 'express';
import { Scan } from '../models/Scan';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    try {
        const scanData = await Scan.create(req.body);
        res.status(201).json(scanData);
    } catch (error) {
        res.status(500).json({ message: 'Error saving scan data', error });
    }
});

router.get('/', async (req: Request, res: Response) => {
    try {
        const scans = await Scan.findAll();
        res.status(200).json(scans);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving scans', error });
    }
});

export default router;
