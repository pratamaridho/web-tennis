import { RegistrationModel, RegistrationStatus } from '@/models/RegistrationModel';

export interface IRegistrationRepository {
  findById(id: string): Promise<RegistrationModel | null>;
  findByTournamentAndUser(tournamentId: string, userId: string): Promise<RegistrationModel | null>;
  findByTournament(tournamentId: string): Promise<RegistrationModel[]>;
  findByUser(userId: string): Promise<RegistrationModel[]>;
  countAccepted(tournamentId: string): Promise<number>;
  countTotal(tournamentId: string): Promise<number>;
  create(tournamentId: string, userId: string): Promise<RegistrationModel>;
  updateStatus(id: string, status: RegistrationStatus): Promise<RegistrationModel>;
}
