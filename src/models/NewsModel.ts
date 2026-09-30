import { UserModel } from './UserModel';

export interface NewsEntityProps {
  id: string;
  judul: string;
  isi: string;
  tanggal: string;
  penulisId: string;
  imageUrl?: string | null;
  penulis?: UserModel | null;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Domain Model for News Entity
 * Follows OOP principles and encapsulates domain business rules for club news & announcements.
 */
export class NewsModel {
  private readonly _id: string;
  private _judul: string;
  private _isi: string;
  private _tanggal: string;
  private _penulisId: string;
  private _imageUrl?: string | null;
  private _penulis?: UserModel | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: NewsEntityProps) {
    if (!props.judul || props.judul.trim().length === 0) {
      throw new Error('Judul berita tidak boleh kosong');
    }
    if (!props.isi || props.isi.trim().length === 0) {
      throw new Error('Isi berita tidak boleh kosong');
    }

    this._id = props.id;
    this._judul = props.judul.trim();
    this._isi = props.isi.trim();
    this._tanggal = props.tanggal?.trim() || new Date().toISOString().split('T')[0];
    this._penulisId = props.penulisId;
    this._imageUrl = props.imageUrl ?? null;
    this._penulis = props.penulis ?? null;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  // Getters
  public get id(): string { return this._id; }
  public get judul(): string { return this._judul; }
  public get isi(): string { return this._isi; }
  public get tanggal(): string { return this._tanggal; }
  public get penulisId(): string { return this._penulisId; }
  public get imageUrl(): string | null | undefined { return this._imageUrl; }
  public get penulis(): UserModel | null | undefined { return this._penulis; }
  public get createdAt(): Date { return this._createdAt; }
  public get updatedAt(): Date { return this._updatedAt; }

  // Domain Business Methods
  public updateContent(data: {
    judul?: string;
    isi?: string;
    tanggal?: string;
    imageUrl?: string | null;
  }): void {
    if (data.judul !== undefined) {
      if (!data.judul.trim()) throw new Error('Judul tidak boleh kosong');
      this._judul = data.judul.trim();
    }
    if (data.isi !== undefined) {
      if (!data.isi.trim()) throw new Error('Isi berita tidak boleh kosong');
      this._isi = data.isi.trim();
    }
    if (data.tanggal !== undefined) {
      this._tanggal = data.tanggal.trim();
    }
    if (data.imageUrl !== undefined) {
      this._imageUrl = data.imageUrl?.trim() || null;
    }
    this._updatedAt = new Date();
  }

  public getSummary(maxLength: number = 140): string {
    if (this._isi.length <= maxLength) return this._isi;
    return this._isi.slice(0, maxLength).trim() + '...';
  }

  public isWrittenBy(userId: string): boolean {
    return this._penulisId === userId;
  }

  public toSafeObject() {
    return {
      id: this._id,
      judul: this._judul,
      isi: this._isi,
      summary: this.getSummary(),
      tanggal: this._tanggal,
      penulisId: this._penulisId,
      imageUrl: this._imageUrl,
      penulisNama: this._penulis?.nama || 'Admin Klub',
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }
}
