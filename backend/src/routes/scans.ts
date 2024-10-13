import express, { Request, Response } from 'express';
import { Scan } from '../models/Scan';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    try {
        const {id, organizationId, readAt, tag, patrollerId, deviceInfo} = req.body;

        console.log('scanData:', req.body);

        const scan = await Scan.create({
            id: id,
            timestamp: readAt,
            status: JSON.stringify(deviceInfo),
            location: JSON.stringify(deviceInfo.geolocation),
            organizationId: organizationId,
            patrollerIdentification: patrollerId,
            tag: tag,
        });
        scan.save();
        res.status(201).json();
    } catch (error) {
        console.error('Error saving scan data:', error);
        res.status(500).json({ message: 'Error saving scan data', error });
    }
});

export default router;
