import dayjs from 'dayjs/esm';
import { IEstudante } from 'app/entities/estudante/estudante.model';
import { ILivro } from 'app/entities/livro/livro.model';

export interface IEmprestimo {
  id: number;
  dataEmprestimo?: dayjs.Dayjs | null;
  status?: string | null;
  estudante?: IEstudante | null;
  livro?: ILivro | null;
}

export type NewEmprestimo = Omit<IEmprestimo, 'id'> & { id: null };
