import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
	res.status(200).json({
		status: 'OK',
		message: 'Server is up and running',
		timestamp: new Date().toISOString()
	});
});

export default router;
