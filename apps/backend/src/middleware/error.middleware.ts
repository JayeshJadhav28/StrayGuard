import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { env } from '../config/env';

export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.error('Error:', err);

	if (err instanceof ZodError) {
		return res.status(400).json({
			error: 'Validation error',
			details: err.errors,
		});
	}

	if ((err as any)?.code && (err as any).code === 'P2002') {
		return res.status(409).json({
			error: 'Duplicate entry',
			field: (err as any).meta?.target,
		});
	}

	res.status(500).json({
		error: env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
	});
};
