import { IAutor, NewAutor } from './autor.model';

export const sampleWithRequiredData: IAutor = {
  id: 30808,
  nomeAutor: 'corrupt coolly ah',
};

export const sampleWithPartialData: IAutor = {
  id: 27540,
  nomeAutor: 'yahoo traduce mmm',
};

export const sampleWithFullData: IAutor = {
  id: 8309,
  nomeAutor: 'ugh though',
};

export const sampleWithNewData: NewAutor = {
  nomeAutor: 'lotion',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
