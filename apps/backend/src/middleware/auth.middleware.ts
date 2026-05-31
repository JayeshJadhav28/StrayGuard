import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface AuthRequest extends Request {
	user?: {
		id: number;
		email: string;
		role: string;
	};
}

export const verifyApiKey = (req: Request, res: Response, next: NextFunction) => {
	const apiKey = req.headers['x-api-key'];

	if (apiKey !== env.API_KEY_DEVICE) {
		return res.status(401).json({ error: 'Invalid API key' });
	}

	next();
};

export const verifyJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader?.split(' ')[1];

	if (!token) {
		return res.status(401).json({ error: 'No token provided' });
	}

	try {
		const decoded = jwt.verify(token, env.JWT_SECRET) as any;
		req.user = decoded;
		next();
	} catch (error) {
		return res.status(403).json({ error: 'Invalid token' });
	}
};

export const requireRole = (...roles: string[]) => {
	return (req: AuthRequest, res: Response, next: NextFunction) => {
		if (!req.user || !roles.includes(req.user.role)) {
			return res.status(403).json({ error: 'Insufficient permissions' });
		}
		next();
	};
};
