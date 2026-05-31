import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/database';
import { env } from '../../config/env';

export class AuthService {
  async login(email: string, password: string) {
    const user = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async createUser(email: string, password: string, role: string = 'agency') {
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.adminUser.create({
      data: {
        email,
        passwordHash,
        role,
      },
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as {
        id: number;
        email: string;
        role: string;
      };
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

export const authService = new AuthService();
