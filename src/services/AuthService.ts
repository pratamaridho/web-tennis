import { IUserRepository } from '@/repositories/interfaces/IUserRepository';
import { PrismaUserRepository } from '@/repositories/PrismaUserRepository';
import { UserModel } from '@/models/UserModel';
import { hashPassword, verifyPassword, signToken } from '@/lib/auth';

export interface RegisterDTO {
  nama: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  user?: UserModel;
  token?: string;
  error?: string;
  statusCode: number;
}

export class AuthService {
  private userRepo: IUserRepository;

  constructor(userRepo?: IUserRepository) {
    this.userRepo = userRepo ?? new PrismaUserRepository();
  }

  /**
   * Use Case: Member Self-Registration (PRD Story A1)
   */
  public async register(dto: RegisterDTO): Promise<AuthResult> {
    const { nama, email, password, confirmPassword } = dto;

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

    if (confirmPassword && password !== confirmPassword) {
      return {
        success: false,
        error: 'Konfirmasi password tidak cocok',
        statusCode: 400,
      };
    }

    const emailNormalized = email.toLowerCase().trim();
    const existing = await this.userRepo.findByEmail(emailNormalized);
    if (existing) {
      return {
        success: false,
        error: 'Email sudah terdaftar. Silakan masuk atau gunakan email lain.',
        statusCode: 409,
      };
    }

    const passwordHash = await hashPassword(password);

    // Self-registered user defaults to active MEMBER
    const newUser = await this.userRepo.create({
      nama: nama.trim(),
      email: emailNormalized,
      passwordHash,
      role: 'MEMBER',
      aktif: true,
    });

    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      nama: newUser.nama,
    });

    return {
      success: true,
      user: newUser,
      token,
      statusCode: 201,
    };
  }

  /**
   * Use Case: User Login
   */
  public async login(dto: LoginDTO): Promise<AuthResult> {
    const { email, password } = dto;

    if (!email || !password) {
      return {
        success: false,
        error: 'Email dan password wajib diisi',
        statusCode: 400,
      };
    }

    const emailNormalized = email.toLowerCase().trim();
    const authData = await this.userRepo.findWithPasswordByEmail(emailNormalized);

    if (!authData) {
      return {
        success: false,
        error: 'Email atau password tidak sesuai',
        statusCode: 401,
      };
    }

    const { user, passwordHash } = authData;

    if (!user.aktif) {
      return {
        success: false,
        error: 'Akun Anda telah dinonaktifkan oleh administrator. Silakan hubungi pengurus.',
        statusCode: 403,
      };
    }

    const isMatch = await verifyPassword(password, passwordHash);
    if (!isMatch) {
      return {
        success: false,
        error: 'Email atau password tidak sesuai',
        statusCode: 401,
      };
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      nama: user.nama,
    });

    return {
      success: true,
      user,
      token,
      statusCode: 200,
    };
  }

  /**
   * Get User by ID
   */
  public async getUserById(userId: string): Promise<UserModel | null> {
    return this.userRepo.findById(userId);
  }
}

// Export singleton instance for dependency injection
export const authService = new AuthService();
