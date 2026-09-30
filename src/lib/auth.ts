import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

const SESSION_COOKIE_NAME = 'tennis_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'tennis-club-super-secret-key-2026';

export interface SessionPayload {
  userId: string;
  email: string;
  role: 'PENGUNJUNG' | 'MEMBER' | 'ADMIN_KOMUNITAS' | 'ADMIN_WEB';
  nama: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: SessionPayload): string {
  const data = JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 });
  const hmac = crypto.createHmac('sha256', SESSION_SECRET);
  hmac.update(data);
  const signature = hmac.digest('base64url');
  return `${Buffer.from(data).toString('base64url')}.${signature}`;
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [encodedData, signature] = parts;

    const data = Buffer.from(encodedData, 'base64url').toString('utf8');
    const hmac = crypto.createHmac('sha256', SESSION_SECRET);
    hmac.update(data);
    const expectedSignature = hmac.digest('base64url');

    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      const parsed = JSON.parse(data);
      if (parsed.exp && parsed.exp < Date.now()) {
        return null;
      }
      return {
        userId: parsed.userId,
        email: parsed.email,
        role: parsed.role,
        nama: parsed.nama,
      };
    }
    return null;
  } catch {
    return null;
  }
}

import { UserModel, UserRole } from '@/models/UserModel';

export async function getCurrentUser(): Promise<UserModel | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      nama: true,
      email: true,
      role: true,
      aktif: true,
      avatarUrl: true,
      phone: true,
      ntrpRating: true,
      club: true,
      racket: true,
      hand: true,
    },
  });

  if (!user || !user.aktif) return null;
  return new UserModel({
    id: user.id,
    nama: user.nama,
    email: user.email,
    role: user.role as UserRole,
    aktif: user.aktif,
    avatarUrl: user.avatarUrl,
    phone: user.phone,
    ntrpRating: user.ntrpRating,
    club: user.club,
    racket: user.racket,
    hand: user.hand,
  });
}

export { SESSION_COOKIE_NAME };

