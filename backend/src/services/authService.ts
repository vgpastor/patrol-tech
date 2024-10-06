import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || '';

export const generateToken = (user: User): string => {
	return jwt.sign({ id: user.id, email: user.email, name: user.name, organizationId: user.organizationId }, JWT_SECRET, { expiresIn: '1d' });
};

export const verifyToken = (token: string): any => {
	return jwt.verify(token, JWT_SECRET);
};

export const hashPassword = async (password: string): Promise<string> => {
	const salt = await bcrypt.genSalt(10);
	return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
	return bcrypt.compare(password, hash);
};
