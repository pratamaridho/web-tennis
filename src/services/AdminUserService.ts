import { IUserRepository } from '@/repositories/interfaces/IUserRepository';
import { PrismaUserRepository } from '@/repositories/PrismaUserRepository';
import { UserModel, UserRole } from '@/models/UserModel';
import { hashPassword } from '@/lib/auth';

export interface CreateAdminKomunitasDTO {
  nama: string;
  email: string;
  password: string;
  phone?: string | null;
  club?: string | null;
}

export class AdminUserService {
  private userRepo: IUserRepository;

  constructor(userRepo?: IUserRepository) {
    this.userRepo = userRepo ?? new PrismaUserRepository();
  }

  /**
   * List all users
   */
  public async getAllUsers(): Promise<UserModel[]> {
    return this.userRepo.findAll();
  }

  /**
   * Use Case: Admin Web creates new Admin Komunitas (PRD Story A2)
   */
  public async createAdminKomunitas(dto: CreateAdminKomunitasDTO): Promise<{
    success: boolean;
    user?: UserModel;
    error?: string;
    statusCode: number;
  }> {
    const { nama, email, password, phone, club } = dto;

    if (!nama || !email || !password) {
      return {
        success: false,
        error: 'Nama, email, dan password wajib diisi',
        statusCode: 400,
      };
    }

    if (password.length < 8) {
      return {
        success: false,
        error: 'Password minimal 8 karakter',
        statusCode: 400,
      };
    }

    const emailNormalized = email.toLowerCase().trim();
    const existing = await this.userRepo.findByEmail(emailNormalized);
    if (existing) {
      return {
        success: false,
        error: 'Email sudah terdaftar dalam sistem',
        statusCode: 409,
      };
    }

    const passwordHash = await hashPassword(password);

    const newUser = await this.userRepo.create({
      nama: nama.trim(),
      email: emailNormalized,
      passwordHash,
      role: 'ADMIN_KOMUNITAS',
      aktif: true,
      phone: phone?.trim() || null,
      club: club?.trim() || null,
    });

    return {
      success: true,
      user: newUser,
      statusCode: 201,
    };
  }

  /**
   * Use Case: Admin Web updates user role or toggles active status (PRD Story A2)
   */
  public async updateUserStatusOrRole(params: {
    adminUserId: string;
    targetUserId: string;
    role?: UserRole;
    aktif?: boolean;
  }): Promise<{
    success: boolean;
    user?: UserModel;
    error?: string;
    statusCode: number;
  }> {
    const { adminUserId, targetUserId, role, aktif } = params;

    const admin = await this.userRepo.findById(adminUserId);
    if (!admin || !admin.canManageUsers()) {
      return {
        success: false,
        error: 'Akses ditolak. Khusus Admin Web.',
        statusCode: 403,
      };
    }

    if (targetUserId === adminUserId && aktif === false) {
      return {
        success: false,
        error: 'Anda tidak dapat menonaktifkan akun Anda sendiri',
        statusCode: 400,
      };
    }

    const targetUser = await this.userRepo.findById(targetUserId);
    if (!targetUser) {
      return {
        success: false,
        error: 'Pengguna tidak ditemukan',
        statusCode: 404,
      };
    }

    const updated = await this.userRepo.update(targetUserId, {
      role,
      aktif,
    });

    return {
      success: true,
      user: updated,
      statusCode: 200,
    };
  }
}

export const adminUserService = new AdminUserService();
