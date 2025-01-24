import { IEstudante, NewEstudante } from './estudante.model';

export const sampleWithRequiredData: IEstudante = {
  id: 25062,
  nomeEstudante: 'ouch',
  email: 'Celia_Pereira@yahoo.com',
  telefone: 'than eyeglasses unblinking',
};

export const sampleWithPartialData: IEstudante = {
  id: 9372,
  nomeEstudante: 'possible snowplow',
  email: 'Morgana_Batista@live.com',
  telefone: 'brr plagiarise everlasting',
};

export const sampleWithFullData: IEstudante = {
  id: 18184,
  nomeEstudante: 'shark functional',
  email: 'Lara_Souza91@live.com',
  telefone: 'likewise blushing',
};

export const sampleWithNewData: NewEstudante = {
  nomeEstudante: 'plump distinction knottily',
  email: 'Leonardo_Barros@yahoo.com',
  telefone: 'godfather',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
