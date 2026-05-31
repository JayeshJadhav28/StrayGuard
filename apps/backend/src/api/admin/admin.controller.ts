import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../../config/database';

export const listUsers = async (_req: Request, res: Response) => {
  const users = await prisma.adminUser.findMany({
    select: { id: true, email: true, role: true, createdAt: true },
  });
  res.json({ users });
};

export const createUser = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  const hash = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.adminUser.create({ data: { email, passwordHash: hash, role } });
    res.status(201).json({ id: user.id, email: user.email, role: user.role });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid id' });

  try {
    await prisma.adminUser.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
