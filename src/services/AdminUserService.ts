import { UserModel } from '@/models/UserModel';
import { IUserRepository } from '@/repositories/interfaces/IUserRepository';
import { PrismaUserRepository } from '@/repositories/PrismaUserRepository';
import { hashPassword } from '@/lib/auth';

export interface ServiceResult<T> {
  success: boolean;
  statusCode: number;
  data?: T;
  error?: string;
  message?: string;
}

export class AdminUserService {
  private userRepository: IUserRepository;

  constructor(userRepository?: IUserRepository) {
    this.userRepository = userRepository ?? new PrismaUserRepository();
  }

  /**
   * PRD A2: Admin Web bisa membuat akun admin komunitas
   * - Hanya ADMIN_WEB yang memiliki akses
   * - Email unik
   * - Password minimal 8 karakter
   */
  public async createAdminKomunitas(
    adminWebUser: UserModel,
    payload: { nama: string; email: string; password: string; phone?: string; club?: string }
  ): Promise<ServiceResult<UserModel>> {
    try {
      if (!adminWebUser.isAdminWeb()) {
        return {
          success: false,
          statusCode: 403,
          error: 'Akses ditolak: Hanya Admin Web yang berhak membuat akun admin komunitas (PRD A2)',
        };
      }

      if (!payload.nama || payload.nama.trim().length === 0) {
        return { success: false, statusCode: 400, error: 'Nama admin wajib diisi' };
      }

      if (!payload.email || !payload.email.includes('@')) {
        return { success: false, statusCode: 400, error: 'Email tidak valid' };
      }

      if (!payload.password || payload.password.length < 8) {
        return {
          success: false,
          statusCode: 400,
          error: 'Password minimal 8 karakter sesuai aturan PRD A1/A2',
        };
      }

      const existing = await this.userRepository.findByEmail(payload.email);
      if (existing) {
        return { success: false, statusCode: 400, error: 'Email sudah terdaftar di sistem' };
      }

      const passwordHash = await hashPassword(payload.password);
      const newAdmin = await this.userRepository.create({
        nama: payload.nama,
        email: payload.email,
        passwordHash,
        role: 'ADMIN_KOMUNITAS',
        aktif: true,
        phone: payload.phone ?? null,
        club: payload.club ?? null,
      });

      return {
        success: true,
        statusCode: 201,
        data: newAdmin,
        message: 'Akun Admin Komunitas berhasil dibuat',
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal membuat akun admin';
      return { success: false, statusCode: 500, error: message };
    }
  }

  /**
   * PRD A2: Admin Web bisa mengaktifkan / menonaktifkan akun admin komunitas & pengguna
   * Proteksi: Admin Web tidak boleh menonaktifkan akunnya sendiri agar sistem tidak terkunci
   */
  public async toggleUserStatus(
    adminWebUser: UserModel,
    targetUserId: string,
    aktif: boolean
  ): Promise<ServiceResult<UserModel>> {
    try {
      if (!adminWebUser.isAdminWeb()) {
        return {
          success: false,
          statusCode: 403,
          error: 'Akses ditolak: Hanya Admin Web yang berhak mengubah status keaktifan akun',
        };
      }

      if (adminWebUser.id === targetUserId) {
        return {
          success: false,
          statusCode: 400,
          error: 'Proteksi Keamanan: Anda tidak dapat menonaktifkan akun Anda sendiri',
        };
      }

      const targetUser = await this.userRepository.findById(targetUserId);
      if (!targetUser) {
        return { success: false, statusCode: 404, error: 'Pengguna tidak ditemukan' };
      }

      const updated = await this.userRepository.update(targetUserId, { aktif });
      return {
        success: true,
        statusCode: 200,
        data: updated,
        message: `Status akun ${updated.nama} berhasil diubah menjadi ${aktif ? 'Aktif' : 'Non-Aktif'}`,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal mengubah status akun';
      return { success: false, statusCode: 500, error: message };
    }
  }

  /**
   * Mengambil daftar pengguna:
   * - ADMIN_WEB: dapat melihat seluruh pengguna (Admin & Member)
   * - ADMIN_KOMUNITAS: dapat melihat daftar Member (PRD F1)
   */
  public async getUsersList(
    currentUser: UserModel,
    filterRole?: 'MEMBER' | 'ADMIN_KOMUNITAS' | 'ADMIN_WEB'
  ): Promise<ServiceResult<UserModel[]>> {
    try {
      if (!currentUser.canManageTournaments()) {
        return {
          success: false,
          statusCode: 403,
          error: 'Akses ditolak: Hanya admin yang dapat melihat daftar pengguna',
        };
      }

      const allUsers = await this.userRepository.findAll();

      // If ADMIN_KOMUNITAS, restrict to MEMBER or non-admin web accounts
      let filtered = allUsers;
      if (!currentUser.isAdminWeb()) {
        // ADMIN_KOMUNITAS can view members (PRD F1)
        filtered = allUsers.filter((u) => u.role === 'MEMBER');
      } else if (filterRole) {
        filtered = allUsers.filter((u) => u.role === filterRole);
      }

      return {
        success: true,
        statusCode: 200,
        data: filtered,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal mengambil daftar pengguna';
      return { success: false, statusCode: 500, error: message };
    }
  }

  /**
   * Update profil oleh user sendiri
   */
  public async updateProfile(
    userId: string,
    data: {
      nama?: string;
      phone?: string | null;
      club?: string | null;
      ntrpRating?: string | null;
      racket?: string | null;
      hand?: string | null;
    }
  ): Promise<ServiceResult<UserModel>> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return { success: false, statusCode: 404, error: 'Pengguna tidak ditemukan' };
      }

      const updated = await this.userRepository.update(userId, data);
      return {
        success: true,
        statusCode: 200,
        data: updated,
        message: 'Profil berhasil diperbarui',
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal memperbarui profil';
      return { success: false, statusCode: 500, error: message };
    }
  }
}

export const adminUserService = new AdminUserService();
