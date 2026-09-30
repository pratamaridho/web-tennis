import { IRegistrationRepository } from '@/repositories/interfaces/IRegistrationRepository';
import { PrismaRegistrationRepository } from '@/repositories/PrismaRegistrationRepository';
import { ITournamentRepository } from '@/repositories/interfaces/ITournamentRepository';
import { PrismaTournamentRepository } from '@/repositories/PrismaTournamentRepository';
import { RegistrationModel, RegistrationStatus } from '@/models/RegistrationModel';
import { UserRole } from '@/models/UserModel';

export class RegistrationService {
  private regRepo: IRegistrationRepository;
  private tournamentRepo: ITournamentRepository;

  constructor(
    regRepo?: IRegistrationRepository,
    tournamentRepo?: ITournamentRepository
  ) {
    this.regRepo = regRepo ?? new PrismaRegistrationRepository();
    this.tournamentRepo = tournamentRepo ?? new PrismaTournamentRepository();
  }

  /**
   * PRD User Story C1: Member mendaftar ke turnamen yang dibuka
   * Invarian:
   * 1. Hanya member yang sudah login yang bisa mendaftar
   * 2. Status turnamen adalah PENDAFTARAN_DIBUKA
   * 3. Kuota peserta diterima belum penuh
   * 4. Belum lewat batas tanggal pendaftaran
   * 5. Satu member hanya bisa mendaftar satu kali per turnamen
   */
  public async registerMember(
    tournamentId: string,
    userId: string,
    userRole: UserRole
  ): Promise<{ success: boolean; registration?: RegistrationModel; error?: string; statusCode: number }> {
    if (userRole === 'PENGUNJUNG') {
      return {
        success: false,
        error: 'Harap masuk sebagai member terlebih dahulu untuk mendaftar turnamen',
        statusCode: 401,
      };
    }

    const tournament = await this.tournamentRepo.findById(tournamentId);
    if (!tournament) {
      return {
        success: false,
        error: 'Turnamen tidak ditemukan',
        statusCode: 404,
      };
    }

    if (!tournament.isRegistrationOpen()) {
      return {
        success: false,
        error: 'Pendaftaran untuk turnamen ini belum dibuka atau sudah ditutup',
        statusCode: 400,
      };
    }

    if (tournament.isPastRegistrationDeadline()) {
      return {
        success: false,
        error: `Batas akhir pendaftaran (${tournament.batasDaftar}) telah lewat`,
        statusCode: 400,
      };
    }

    const acceptedCount = await this.regRepo.countAccepted(tournamentId);
    if (acceptedCount >= tournament.kuota) {
      return {
        success: false,
        error: 'Kuota turnamen sudah penuh',
        statusCode: 400,
      };
    }

    const existingReg = await this.regRepo.findByTournamentAndUser(tournamentId, userId);
    if (existingReg) {
      return {
        success: false,
        error: `Anda sudah terdaftar di turnamen ini dengan status: ${existingReg.status}`,
        statusCode: 409,
      };
    }

    const newReg = await this.regRepo.create(tournamentId, userId);

    return {
      success: true,
      registration: newReg,
      statusCode: 201,
    };
  }

  /**
   * PRD User Story C2: Member melihat status pendaftarannya
   */
  public async getMemberRegistration(
    tournamentId: string,
    userId: string
  ): Promise<RegistrationModel | null> {
    return this.regRepo.findByTournamentAndUser(tournamentId, userId);
  }

  public async getMemberAllRegistrations(userId: string): Promise<RegistrationModel[]> {
    return this.regRepo.findByUser(userId);
  }

  /**
   * PRD User Story C3: Admin Komunitas melihat daftar pendaftar
   */
  public async getTournamentRegistrations(
    tournamentId: string,
    role: UserRole
  ): Promise<{ success: boolean; registrations?: RegistrationModel[]; error?: string; statusCode: number }> {
    if (role !== 'ADMIN_KOMUNITAS' && role !== 'ADMIN_WEB') {
      return {
        success: false,
        error: 'Akses ditolak. Khusus Admin.',
        statusCode: 403,
      };
    }

    const list = await this.regRepo.findByTournament(tournamentId);
    return {
      success: true,
      registrations: list,
      statusCode: 200,
    };
  }

  /**
   * PRD User Story C3: Admin Komunitas menerima atau menolak pendaftar.
   * Invarian: Jumlah peserta Diterima tidak boleh melebihi kuota.
   */
  public async updateRegistrationStatus(
    registrationId: string,
    newStatus: RegistrationStatus,
    role: UserRole
  ): Promise<{ success: boolean; registration?: RegistrationModel; error?: string; statusCode: number }> {
    if (role !== 'ADMIN_KOMUNITAS' && role !== 'ADMIN_WEB') {
      return {
        success: false,
        error: 'Akses ditolak. Khusus Admin.',
        statusCode: 403,
      };
    }

    const registration = await this.regRepo.findById(registrationId);
    if (!registration) {
      return {
        success: false,
        error: 'Data pendaftaran tidak ditemukan',
        statusCode: 404,
      };
    }

    // Invariant: If accepting, verify quota is not exceeded
    if (newStatus === 'DITERIMA' && registration.status !== 'DITERIMA') {
      const tournament = await this.tournamentRepo.findById(registration.tournamentId);
      if (!tournament) {
        return {
          success: false,
          error: 'Turnamen tidak ditemukan',
          statusCode: 404,
        };
      }

      const currentAccepted = await this.regRepo.countAccepted(registration.tournamentId);
      if (currentAccepted >= tournament.kuota) {
        return {
          success: false,
          error: `Kuota peserta diterima telah mencapai batas maksimal (${tournament.kuota} peserta)`,
          statusCode: 400,
        };
      }
    }

    const updated = await this.regRepo.updateStatus(registrationId, newStatus);

    return {
      success: true,
      registration: updated,
      statusCode: 200,
    };
  }
}

export const registrationService = new RegistrationService();
