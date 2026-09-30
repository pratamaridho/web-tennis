export type RegistrationStatus = 'MENUNGGU' | 'DITERIMA' | 'DITOLAK';

export interface ParticipantInfo {
  id: string;
  nama: string;
  email: string;
  club?: string | null;
  phone?: string | null;
  ntrpRating?: string | null;
  racket?: string | null;
  hand?: string | null;
}

export interface RegistrationEntityProps {
  id: string;
  tournamentId: string;
  userId: string;
  status: RegistrationStatus;
  createdAt?: Date;
  user?: ParticipantInfo | null;
  tournamentName?: string;
}

/**
 * Domain Model for Registration Entity with PRD validation rules
 */
export class RegistrationModel {
  private readonly _id: string;
  private readonly _tournamentId: string;
  private readonly _userId: string;
  private _status: RegistrationStatus;
  private readonly _createdAt: Date;
  private _user?: ParticipantInfo | null;
  private _tournamentName?: string;

  constructor(props: RegistrationEntityProps) {
    this._id = props.id;
    this._tournamentId = props.tournamentId;
    this._userId = props.userId;
    this._status = props.status;
    this._createdAt = props.createdAt ?? new Date();
    this._user = props.user ?? null;
    this._tournamentName = props.tournamentName;
  }

  public get id(): string { return this._id; }
  public get tournamentId(): string { return this._tournamentId; }
  public get userId(): string { return this._userId; }
  public get status(): RegistrationStatus { return this._status; }
  public get createdAt(): Date { return this._createdAt; }
  public get user(): ParticipantInfo | null | undefined { return this._user; }
  public get tournamentName(): string | undefined { return this._tournamentName; }

  public isPending(): boolean {
    return this._status === 'MENUNGGU';
  }

  public isAccepted(): boolean {
    return this._status === 'DITERIMA';
  }

  public isRejected(): boolean {
    return this._status === 'DITOLAK';
  }

  public accept(): void {
    this._status = 'DITERIMA';
  }

  public reject(): void {
    this._status = 'DITOLAK';
  }

  public toSafeObject() {
    return {
      id: this._id,
      tournamentId: this._tournamentId,
      userId: this._userId,
      status: this._status,
      user: this._user,
      tournamentName: this._tournamentName,
      createdAt: this._createdAt.toISOString(),
    };
  }
}
