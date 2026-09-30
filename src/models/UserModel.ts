export type UserRole = 'PENGUNJUNG' | 'MEMBER' | 'ADMIN_KOMUNITAS' | 'ADMIN_WEB';

export interface UserEntityProps {
  id: string;
  nama: string;
  email: string;
  role: UserRole;
  aktif: boolean;
  phone?: string | null;
  club?: string | null;
  ntrpRating?: string | null;
  racket?: string | null;
  hand?: string | null;
  avatarUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Domain Model for User Entity with business encapsulation and OOP methods
 */
export class UserModel {
  private readonly _id: string;
  private _nama: string;
  private _email: string;
  private _role: UserRole;
  private _aktif: boolean;
  private _phone?: string | null;
  private _club?: string | null;
  private _ntrpRating?: string | null;
  private _racket?: string | null;
  private _hand?: string | null;
  private _avatarUrl?: string | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: UserEntityProps) {
    this._id = props.id;
    this._nama = props.nama;
    this._email = props.email.toLowerCase().trim();
    this._role = props.role;
    this._aktif = props.aktif;
    this._phone = props.phone ?? null;
    this._club = props.club ?? null;
    this._ntrpRating = props.ntrpRating ?? null;
    this._racket = props.racket ?? null;
    this._hand = props.hand ?? null;
    this._avatarUrl = props.avatarUrl ?? null;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  // Getters
  public get id(): string { return this._id; }
  public get nama(): string { return this._nama; }
  public get email(): string { return this._email; }
  public get role(): UserRole { return this._role; }
  public get aktif(): boolean { return this._aktif; }
  public get phone(): string | null | undefined { return this._phone; }
  public get club(): string | null | undefined { return this._club; }
  public get ntrpRating(): string | null | undefined { return this._ntrpRating; }
  public get racket(): string | null | undefined { return this._racket; }
  public get hand(): string | null | undefined { return this._hand; }
  public get avatarUrl(): string | null | undefined { return this._avatarUrl; }
  public get createdAt(): Date { return this._createdAt; }
  public get updatedAt(): Date { return this._updatedAt; }

  // Domain Business Methods
  public isAdminWeb(): boolean {
    return this._role === 'ADMIN_WEB';
  }

  public isAdminKomunitas(): boolean {
    return this._role === 'ADMIN_KOMUNITAS';
  }

  public isMember(): boolean {
    return this._role === 'MEMBER';
  }

  public canManageUsers(): boolean {
    return this.isAdminWeb();
  }

  public canManageTournaments(): boolean {
    return this.isAdminWeb() || this.isAdminKomunitas();
  }

  public updateProfile(data: {
    nama?: string;
    phone?: string | null;
    club?: string | null;
    ntrpRating?: string | null;
    racket?: string | null;
    hand?: string | null;
  }): void {
    if (data.nama) this._nama = data.nama.trim();
    if (data.phone !== undefined) this._phone = data.phone?.trim() ?? null;
    if (data.club !== undefined) this._club = data.club?.trim() ?? null;
    if (data.ntrpRating !== undefined) this._ntrpRating = data.ntrpRating?.trim() ?? null;
    if (data.racket !== undefined) this._racket = data.racket?.trim() ?? null;
    if (data.hand !== undefined) this._hand = data.hand?.trim() ?? null;
    this._updatedAt = new Date();
  }

  public setStatus(aktif: boolean): void {
    this._aktif = aktif;
    this._updatedAt = new Date();
  }

  public setRole(role: UserRole): void {
    this._role = role;
    this._updatedAt = new Date();
  }

  // Safe Serialization (excluding sensitive fields like raw password)
  public toSafeObject() {
    return {
      id: this._id,
      nama: this._nama,
      email: this._email,
      role: this._role,
      aktif: this._aktif,
      phone: this._phone,
      club: this._club,
      ntrpRating: this._ntrpRating,
      racket: this._racket,
      hand: this._hand,
      avatarUrl: this._avatarUrl,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }
}
