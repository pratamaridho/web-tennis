import { NewsModel } from '@/models/NewsModel';

export interface CreateNewsData {
  judul: string;
  isi: string;
  tanggal?: string;
  penulisId: string;
  imageUrl?: string | null;
}

export interface UpdateNewsData {
  judul?: string;
  isi?: string;
  tanggal?: string;
  imageUrl?: string | null;
}

export interface INewsRepository {
  findById(id: string): Promise<NewsModel | null>;
  findAll(): Promise<NewsModel[]>;
  create(data: CreateNewsData): Promise<NewsModel>;
  update(id: string, data: UpdateNewsData): Promise<NewsModel>;
  delete(id: string): Promise<boolean>;
}
