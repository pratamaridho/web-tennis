import { IUserRepository } from '@/repositories/interfaces/IUserRepository';
import { PrismaUserRepository } from '@/repositories/PrismaUserRepository';
import { UserModel } from '@/models/UserModel';

export interface UpdateProfileDTO {
  userId: string;
  nama?: string;
  phone?: string | null;
  club?: string | null;
  ntrpRating?: string | null;
  racket?: string | null;
  hand?: string | null;
}

export class ProfileService {
  private userRepo: IUserRepository;

  constructor(userRepo?: IUserRepository) {
    this.userRepo = userRepo ?? new PrismaUserRepository();
  }

  public async getProfile(userId: string): Promise<UserModel | null> {
    return this.userRepo.findById(userId);
  }

  public async updateProfile(dto: UpdateProfileDTO): Promise<{
    success: boolean;
    user?: UserModel;
    error?: string;
    statusCode: number;
  }> {
    const { userId, nama, phone, club, ntrpRating, racket, hand } = dto;

    const user = await this.userRepo.findById(userId);
    if (!user) {
      return {
        success: false,
        error: 'Pengguna tidak ditemukan',
        statusCode: 404,
      };
    }

    const updated = await this.userRepo.update(userId, {
      nama,
      phone,
      club,
      ntrpRating,
      racket,
      hand,
    });

    return {
      success: true,
      user: updated,
      statusCode: 200,
    };
  }
}

export const profileService = new ProfileService();
