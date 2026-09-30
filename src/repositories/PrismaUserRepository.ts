import { prisma } from '@/lib/prisma';
import { UserModel, UserRole } from '@/models/UserModel';
import {
  IUserRepository,
  CreateUserData,
  UserWithPassword,
} from './interfaces/IUserRepository';
import { Role } from '@prisma/client';

export class PrismaUserRepository implements IUserRepository {
  public async findById(id: string): Promise<UserModel | null> {
    const record = await prisma.user.findUnique({
      where: { id },
    });
    if (!record) return null;

    return new UserModel({
      id: record.id,
      nama: record.nama,
      email: record.email,
      role: record.role as UserRole,
      aktif: record.aktif,
      phone: record.phone,
      club: record.club,
      ntrpRating: record.ntrpRating,
      racket: record.racket,
      hand: record.hand,
      avatarUrl: record.avatarUrl,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  public async findByEmail(email: string): Promise<UserModel | null> {
    const record = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    if (!record) return null;

    return new UserModel({
      id: record.id,
      nama: record.nama,
      email: record.email,
      role: record.role as UserRole,
      aktif: record.aktif,
      phone: record.phone,
      club: record.club,
      ntrpRating: record.ntrpRating,
      racket: record.racket,
      hand: record.hand,
      avatarUrl: record.avatarUrl,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  public async findWithPasswordByEmail(email: string): Promise<UserWithPassword | null> {
    const record = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    if (!record) return null;

    const user = new UserModel({
      id: record.id,
      nama: record.nama,
      email: record.email,
      role: record.role as UserRole,
      aktif: record.aktif,
      phone: record.phone,
      club: record.club,
      ntrpRating: record.ntrpRating,
      racket: record.racket,
      hand: record.hand,
      avatarUrl: record.avatarUrl,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });

    return {
      user,
      passwordHash: record.password,
    };
  }

  public async findAll(): Promise<UserModel[]> {
    const records = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return records.map(
      (record) =>
        new UserModel({
          id: record.id,
          nama: record.nama,
          email: record.email,
          role: record.role as UserRole,
          aktif: record.aktif,
          phone: record.phone,
          club: record.club,
          ntrpRating: record.ntrpRating,
          racket: record.racket,
          hand: record.hand,
          avatarUrl: record.avatarUrl,
          createdAt: record.createdAt,
          updatedAt: record.updatedAt,
        })
    );
  }

  public async create(data: CreateUserData): Promise<UserModel> {
    const record = await prisma.user.create({
      data: {
        nama: data.nama.trim(),
        email: data.email.toLowerCase().trim(),
        password: data.passwordHash,
        role: data.role as Role,
        aktif: data.aktif ?? true,
        phone: data.phone ?? null,
        club: data.club ?? null,
      },
    });

    return new UserModel({
      id: record.id,
      nama: record.nama,
      email: record.email,
      role: record.role as UserRole,
      aktif: record.aktif,
      phone: record.phone,
      club: record.club,
      ntrpRating: record.ntrpRating,
      racket: record.racket,
      hand: record.hand,
      avatarUrl: record.avatarUrl,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  public async update(
    id: string,
    data: Partial<{
      nama: string;
      role: UserRole;
      aktif: boolean;
      phone: string | null;
      club: string | null;
      ntrpRating: string | null;
      racket: string | null;
      hand: string | null;
    }>
  ): Promise<UserModel> {
    const updatePayload: Record<string, unknown> = {};
    if (data.nama !== undefined) updatePayload.nama = data.nama.trim();
    if (data.role !== undefined) updatePayload.role = data.role as Role;
    if (data.aktif !== undefined) updatePayload.aktif = data.aktif;
    if (data.phone !== undefined) updatePayload.phone = data.phone;
    if (data.club !== undefined) updatePayload.club = data.club;
    if (data.ntrpRating !== undefined) updatePayload.ntrpRating = data.ntrpRating;
    if (data.racket !== undefined) updatePayload.racket = data.racket;
    if (data.hand !== undefined) updatePayload.hand = data.hand;

    const record = await prisma.user.update({
      where: { id },
      data: updatePayload,
    });

    return new UserModel({
      id: record.id,
      nama: record.nama,
      email: record.email,
      role: record.role as UserRole,
      aktif: record.aktif,
      phone: record.phone,
      club: record.club,
      ntrpRating: record.ntrpRating,
      racket: record.racket,
      hand: record.hand,
      avatarUrl: record.avatarUrl,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
