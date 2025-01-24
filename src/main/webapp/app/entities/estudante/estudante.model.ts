export interface IEstudante {
  id: number;
  nomeEstudante?: string | null;
  email?: string | null;
  telefone?: string | null;
}

export type NewEstudante = Omit<IEstudante, 'id'> & { id: null };
