import { UserModel, UserRole } from '@/models/UserModel';

export interface CreateUserData {
  nama: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  aktif?: boolean;
  phone?: string | null;
  club?: string | null;
}

export interface UserWithPassword {
  user: UserModel;
  passwordHash: string;
}

export interface IUserRepository {
  findById(id: string): Promise<UserModel | null>;
  findByEmail(email: string): Promise<UserModel | null>;
  findWithPasswordByEmail(email: string): Promise<UserWithPassword | null>;
  findAll(): Promise<UserModel[]>;
  create(data: CreateUserData): Promise<UserModel>;
  update(id: string, data: Partial<{
    nama: string;
    role: UserRole;
    aktif: boolean;
    phone: string | null;
    club: string | null;
    ntrpRating: string | null;
    racket: string | null;
    hand: string | null;
  }>): Promise<UserModel>;
}
