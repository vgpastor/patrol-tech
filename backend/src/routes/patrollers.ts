import express, { Request, Response } from "express";
import {Patroller} from "../models/Patroller";
import {authenticateJWT} from "./authMiddleware"
const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
	try {
		if (!req.user) {
			return res.status(401).json({ message: 'Unauthorized' });
		}
		Patroller.findByOrganizationId(
			req.user.organizationId,
			{limit: 25, page: 1}
		).then((patrollers) => {
			res.status(200).json(patrollers);
		});
	} catch (error) {
		console.error('Error retrieving checkpoints:', error);
		res.status(500).json({ message: 'Error retrieving checkpoints', error });
	}
});

export default router;
