import { ITournamentRepository } from '@/repositories/interfaces/ITournamentRepository';
import { PrismaTournamentRepository } from '@/repositories/PrismaTournamentRepository';
import {
  TournamentModel,
  TournamentFormat,
  TournamentStatus,
} from '@/models/TournamentModel';
import { UserRole } from '@/models/UserModel';

export interface CreateTournamentDTO {
  nama: string;
  deskripsi?: string | null;
  tanggal: string;
  lokasi: string;
  kuota: number;
  batasDaftar: string;
  aturan?: string | null;
  format: TournamentFormat;
  status?: TournamentStatus;
}

export interface UpdateTournamentDTO {
  nama?: string;
  deskripsi?: string | null;
  tanggal?: string;
  lokasi?: string;
  kuota?: number;
  batasDaftar?: string;
  aturan?: string | null;
  format?: TournamentFormat;
  status?: TournamentStatus;
}

export class TournamentService {
  private tournamentRepo: ITournamentRepository;

  constructor(tournamentRepo?: ITournamentRepository) {
    this.tournamentRepo = tournamentRepo ?? new PrismaTournamentRepository();
  }

  /**
   * PRD Invariant E1: Pengunjung tanpa login dapat melihat semua turnamen non-DRAFT.
   * Admin Komunitas dan Admin Web dapat melihat seluruh turnamen termasuk DRAFT.
   */
  public async getTournaments(role: UserRole = 'PENGUNJUNG'): Promise<TournamentModel[]> {
    const canSeeDrafts = role === 'ADMIN_WEB' || role === 'ADMIN_KOMUNITAS';
    return this.tournamentRepo.findAll(canSeeDrafts);
  }

  public async getTournamentById(id: string): Promise<TournamentModel | null> {
    return this.tournamentRepo.findById(id);
  }

  /**
   * PRD User Story B1: Admin Komunitas / Admin Web membuat turnamen
   */
  public async createTournament(
    dto: CreateTournamentDTO,
    role: UserRole
  ): Promise<{ success: boolean; tournament?: TournamentModel; error?: string; statusCode: number }> {
    if (role !== 'ADMIN_KOMUNITAS' && role !== 'ADMIN_WEB') {
      return {
        success: false,
        error: 'Akses ditolak. Khusus Admin Komunitas atau Admin Web.',
        statusCode: 403,
      };
    }

    if (!dto.nama || !dto.tanggal || !dto.lokasi || !dto.kuota || !dto.batasDaftar) {
      return {
        success: false,
        error: 'Nama, tanggal, lokasi, kuota, dan batas daftar wajib diisi',
        statusCode: 400,
      };
    }

    if (dto.kuota < 2) {
      return {
        success: false,
        error: 'Kuota turnamen minimal 2 peserta',
        statusCode: 400,
      };
    }

    const created = await this.tournamentRepo.create({
      nama: dto.nama,
      deskripsi: dto.deskripsi,
      tanggal: dto.tanggal,
      lokasi: dto.lokasi,
      kuota: dto.kuota,
      batasDaftar: dto.batasDaftar,
      aturan: dto.aturan,
      format: dto.format || 'KNOCKOUT',
      status: dto.status || 'DRAFT',
    });

    return {
      success: true,
      tournament: created,
      statusCode: 201,
    };
  }

  /**
   * PRD User Story B2: Edit turnamen selama belum berstatus Berlangsung / Selesai
   */
  public async updateTournament(
    id: string,
    dto: UpdateTournamentDTO,
    role: UserRole
  ): Promise<{ success: boolean; tournament?: TournamentModel; error?: string; statusCode: number }> {
    if (role !== 'ADMIN_KOMUNITAS' && role !== 'ADMIN_WEB') {
      return {
        success: false,
        error: 'Akses ditolak. Khusus Admin.',
        statusCode: 403,
      };
    }

    const existing = await this.tournamentRepo.findById(id);
    if (!existing) {
      return {
        success: false,
        error: 'Turnamen tidak ditemukan',
        statusCode: 404,
      };
    }

    // PRD Invariant B2: Turnamen hanya bisa diedit selama belum berstatus Berlangsung
    if (!existing.canBeEdited()) {
      return {
        success: false,
        error: 'Turnamen yang sudah Berlangsung atau Selesai tidak dapat diedit',
        statusCode: 400,
      };
    }

    const updated = await this.tournamentRepo.update(id, dto);

    return {
      success: true,
      tournament: updated,
      statusCode: 200,
    };
  }

  /**
   * Admin alters tournament status (DRAFT -> PENDAFTARAN_DIBUKA -> BERLANGSUNG -> SELESAI)
   */
  public async updateStatus(
    id: string,
    newStatus: TournamentStatus,
    role: UserRole
  ): Promise<{ success: boolean; tournament?: TournamentModel; error?: string; statusCode: number }> {
    if (role !== 'ADMIN_KOMUNITAS' && role !== 'ADMIN_WEB') {
      return {
        success: false,
        error: 'Akses ditolak. Khusus Admin.',
        statusCode: 403,
      };
    }

    const existing = await this.tournamentRepo.findById(id);
    if (!existing) {
      return {
        success: false,
        error: 'Turnamen tidak ditemukan',
        statusCode: 404,
      };
    }

    const updated = await this.tournamentRepo.update(id, { status: newStatus });

    return {
      success: true,
      tournament: updated,
      statusCode: 200,
    };
  }
}

export const tournamentService = new TournamentService();
