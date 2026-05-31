import { Request, Response } from 'express';
import { z } from 'zod';
import { authService } from './auth.service';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = loginSchema.extend({
  role: z.enum(['admin', 'agency', 'ngo']).optional(),
});

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = registerSchema.parse(req.body);
    const user = await authService.createUser(email, password, role as any);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const me = async (req: Request, res: Response) => {
  // `verifyJWT` middleware attaches `req.user`
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  res.json((req as any).user || null);
};
export const authController = {} as const;
