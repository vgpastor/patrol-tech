import express, { Request, Response } from 'express';
import { User } from '../models/User';
import { Organization } from '../models/Organization';
import { Location } from '../models/Location';
import sequelize from '../db';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import {Patroller} from "../models/Patroller";
import {Checkpoint} from "../models/Checkpoint";
import {generateToken} from "../services/authService";
import { sendPasswordEmail } from '../services/emailService';

const router = express.Router();

function generateRandomPassword(length: number = 12): string {
	return crypto.randomBytes(length).toString('hex').slice(0, length);
}

router.post('/login', async (req: Request, res: Response) => {
	try {
		const {email, password} = req.body;

		const user = await User.findOne({where: {email}});
		if (!user) {
			return res.status(404).json({message: 'Invalid credentials'});
		}

		const isPasswordValid = await user.comparePassword(password);
		if (!isPasswordValid) {
			return res.status(401).json({message: 'Invalid credentials'});
		}

		res.status(200).json(generateToken(user));
	}catch (e) {
		res.status(401).json({message: 'Invalid credentials'});
	}
})

router.post('/register', async (req: Request, res: Response) => {
	try {
		const { id, name, email } = req.body;

		const existingUser = await User.findOne({ where: { email } });
		if (existingUser) {
			return res.status(400).json({ message: 'User already exists' });
		}

		const randomPassword = generateRandomPassword();

		const newUser = await User.create({ id, name, email, password: randomPassword });

		try {
			await sendPasswordEmail(newUser, randomPassword);
		} catch (emailError) {
			console.error('Error sending password email:', emailError);
		}

		res.status(200).json(generateToken(newUser));
	} catch (error) {
		console.error('Registration error:', error);
		res.status(500).json({ message: 'Error registering user', error });
	}
});

export default router;