import { ILivro, NewLivro } from './livro.model';

export const sampleWithRequiredData: ILivro = {
  id: 158,
  titulo: 'calculating even',
  quantidade: 26861,
};

export const sampleWithPartialData: ILivro = {
  id: 14655,
  titulo: 'rarely unfreeze',
  quantidade: 13910,
};

export const sampleWithFullData: ILivro = {
  id: 2308,
  titulo: 'until woot geez',
  quantidade: 27019,
};

export const sampleWithNewData: NewLivro = {
  titulo: 'aha',
  quantidade: 10290,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
