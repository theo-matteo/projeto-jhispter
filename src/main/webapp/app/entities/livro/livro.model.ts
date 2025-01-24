import { IAutor } from 'app/entities/autor/autor.model';

export interface ILivro {
  id: number;
  titulo?: string | null;
  quantidade?: number | null;
  autor?: IAutor | null;
}

export type NewLivro = Omit<ILivro, 'id'> & { id: null };
