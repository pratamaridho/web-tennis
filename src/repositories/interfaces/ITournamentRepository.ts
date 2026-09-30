import { TournamentModel, TournamentFormat, TournamentStatus } from '@/models/TournamentModel';

export interface CreateTournamentData {
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

export interface UpdateTournamentData {
  nama?: string;
  deskripsi?: string | null;
  tanggal?: string;
  lokasi?: string;
  kuota?: number;
  batasDaftar?: string;
  aturan?: string | null;
  format?: TournamentFormat;
  status?: TournamentStatus;
  juaraId?: string | null;
}

export interface ITournamentRepository {
  findById(id: string): Promise<TournamentModel | null>;
  findAll(includeDrafts?: boolean): Promise<TournamentModel[]>;
  create(data: CreateTournamentData): Promise<TournamentModel>;
  update(id: string, data: UpdateTournamentData): Promise<TournamentModel>;
  delete(id: string): Promise<boolean>;
}
