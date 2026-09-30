export type TournamentFormat = 'KNOCKOUT' | 'ROUND_ROBIN';
export type TournamentStatus = 'DRAFT' | 'PENDAFTARAN_DIBUKA' | 'BERLANGSUNG' | 'SELESAI';

export interface TournamentEntityProps {
  id: string;
  nama: string;
  deskripsi?: string | null;
  tanggal: string;
  lokasi: string;
  kuota: number;
  batasDaftar: string;
  aturan?: string | null;
  format: TournamentFormat;
  status: TournamentStatus;
  imageUrl?: string | null;
  juaraId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  acceptedCount?: number;
  totalRegistrationsCount?: number;
}

/**
 * Domain Model for Tournament Entity with business encapsulation and OOP methods
 */
export class TournamentModel {
  private readonly _id: string;
  private _nama: string;
  private _deskripsi?: string | null;
  private _tanggal: string;
  private _lokasi: string;
  private _kuota: number;
  private _batasDaftar: string;
  private _aturan?: string | null;
  private _format: TournamentFormat;
  private _status: TournamentStatus;
  private _imageUrl?: string | null;
  private _juaraId?: string | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;
  private _acceptedCount: number;
  private _totalRegistrationsCount: number;

  constructor(props: TournamentEntityProps) {
    this._id = props.id;
    this._nama = props.nama.trim();
    this._deskripsi = props.deskripsi ?? null;
    this._tanggal = props.tanggal.trim();
    this._lokasi = props.lokasi.trim();
    this._kuota = Math.max(2, props.kuota);
    this._batasDaftar = props.batasDaftar.trim();
    this._aturan = props.aturan ?? null;
    this._format = props.format;
    this._status = props.status;
    this._imageUrl = props.imageUrl ?? null;
    this._juaraId = props.juaraId ?? null;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
    this._acceptedCount = props.acceptedCount ?? 0;
    this._totalRegistrationsCount = props.totalRegistrationsCount ?? 0;
  }

  // Getters
  public get id(): string { return this._id; }
  public get nama(): string { return this._nama; }
  public get deskripsi(): string | null | undefined { return this._deskripsi; }
  public get tanggal(): string { return this._tanggal; }
  public get lokasi(): string { return this._lokasi; }
  public get kuota(): number { return this._kuota; }
  public get batasDaftar(): string { return this._batasDaftar; }
  public get aturan(): string | null | undefined { return this._aturan; }
  public get format(): TournamentFormat { return this._format; }
  public get status(): TournamentStatus { return this._status; }
  public get imageUrl(): string | null | undefined { return this._imageUrl; }
  public get juaraId(): string | null | undefined { return this._juaraId; }
  public get createdAt(): Date { return this._createdAt; }
  public get updatedAt(): Date { return this._updatedAt; }
  public get acceptedCount(): number { return this._acceptedCount; }
  public get totalRegistrationsCount(): number { return this._totalRegistrationsCount; }

  // PRD Business Invariants
  public isRegistrationOpen(): boolean {
    return this._status === 'PENDAFTARAN_DIBUKA';
  }

  public isQuotaFull(): boolean {
    return this._acceptedCount >= this._kuota;
  }

  public isPastRegistrationDeadline(): boolean {
    const deadline = new Date(this._batasDaftar);
    if (isNaN(deadline.getTime())) {
      // If natural language date string, fallback to allowed
      return false;
    }
    return new Date() > deadline;
  }

  /**
   * PRD Invariant: Pendaftaran hanya bisa dilakukan jika status PENDAFTARAN_DIBUKA,
   * kuota belum penuh, dan belum lewat batas daftar.
   */
  public canAcceptRegistration(): boolean {
    return this.isRegistrationOpen() && !this.isQuotaFull() && !this.isPastRegistrationDeadline();
  }

  /**
   * PRD Invariant B2: Turnamen hanya bisa diedit selama belum berstatus Berlangsung / Selesai
   */
  public canBeEdited(): boolean {
    return this._status === 'DRAFT' || this._status === 'PENDAFTARAN_DIBUKA';
  }

  /**
   * PRD Invariant E1: Pengunjung tanpa login dapat melihat semua turnamen non-DRAFT
   */
  public isPubliclyVisible(): boolean {
    return this._status !== 'DRAFT';
  }

  public updateDetails(data: {
    nama?: string;
    deskripsi?: string | null;
    tanggal?: string;
    lokasi?: string;
    kuota?: number;
    batasDaftar?: string;
    aturan?: string | null;
    format?: TournamentFormat;
    imageUrl?: string | null;
  }): void {
    if (!this.canBeEdited()) {
      throw new Error('Turnamen yang sudah Berlangsung atau Selesai tidak dapat diedit');
    }
    if (data.nama) this._nama = data.nama.trim();
    if (data.deskripsi !== undefined) this._deskripsi = data.deskripsi;
    if (data.tanggal) this._tanggal = data.tanggal.trim();
    if (data.lokasi) this._lokasi = data.lokasi.trim();
    if (data.kuota !== undefined) this._kuota = Math.max(2, data.kuota);
    if (data.batasDaftar) this._batasDaftar = data.batasDaftar.trim();
    if (data.aturan !== undefined) this._aturan = data.aturan;
    if (data.format) this._format = data.format;
    if (data.imageUrl !== undefined) this._imageUrl = data.imageUrl;
    this._updatedAt = new Date();
  }

  public setStatus(newStatus: TournamentStatus): void {
    this._status = newStatus;
    this._updatedAt = new Date();
  }

  public setJuaraId(juaraId: string | null): void {
    this._juaraId = juaraId;
    this._updatedAt = new Date();
  }

  public toSafeObject() {
    return {
      id: this._id,
      nama: this._nama,
      deskripsi: this._deskripsi,
      tanggal: this._tanggal,
      lokasi: this._lokasi,
      kuota: this._kuota,
      batasDaftar: this._batasDaftar,
      aturan: this._aturan,
      format: this._format,
      status: this._status,
      imageUrl: this._imageUrl,
      juaraId: this._juaraId,
      acceptedCount: this._acceptedCount,
      totalRegistrationsCount: this._totalRegistrationsCount,
      isQuotaFull: this.isQuotaFull(),
      canRegister: this.canAcceptRegistration(),
      canBeEdited: this.canBeEdited(),
      isPubliclyVisible: this.isPubliclyVisible(),
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }
}
