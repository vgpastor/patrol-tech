import express, { Request, Response } from "express";
import {Patroller} from "../models/Patroller";

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


router.post('/', async (req: Request, res: Response) => {
	try {
		if (!req.user) {
			return res.status(401).json({ message: 'Unauthorized' });
		}
		let {id, name, identifier, email, phone } = req.body;

		if (identifier === undefined) {
			identifier = await Patroller.generateUniqueIdentifier();
		}

		const patroller = await Patroller.create({
			id,
			name,
			identifier,
			email,
			phone,
			organizationId: req.user.organizationId,
		});
		res.status(201).json(patroller);
	} catch (error) {
		console.error('Error creating patroller:', error);
		res.status(500).json({ message: 'Error creating patroller', error });
	}
});

export default router;
