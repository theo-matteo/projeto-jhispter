export interface IAutor {
  id: number;
  nomeAutor?: string | null;
}

export type NewAutor = Omit<IAutor, 'id'> & { id: null };
