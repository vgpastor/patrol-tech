import express, { Request, Response } from "express";
import {Checkpoint} from "../models/Checkpoint";

declare global {
	namespace Express {
		interface Request {
			user?: {
				id: string;
				email: string;
				name: string;
				organizationId: string;
			};
		}
	}
}

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
	try {
		if (!req.user) {
			return res.status(401).json({ message: 'Unauthorized' });
		}
		Checkpoint.findByOrganizationId(
			req.user.organizationId,
			{limit: 25, page: 1}
		).then((checkpoints) => {
			res.status(200).json(checkpoints);
		});
	} catch (error) {
		console.error('Error retrieving checkpoints:', error);
		res.status(500).json({ message: 'Error retrieving checkpoints', error });
	}
});

export default router;
