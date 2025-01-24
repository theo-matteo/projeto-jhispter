import dayjs from 'dayjs/esm';

import { IEmprestimo, NewEmprestimo } from './emprestimo.model';

export const sampleWithRequiredData: IEmprestimo = {
  id: 17451,
  dataEmprestimo: dayjs('2025-01-24T00:30'),
  status: 'yahoo intensely',
};

export const sampleWithPartialData: IEmprestimo = {
  id: 2904,
  dataEmprestimo: dayjs('2025-01-24T10:32'),
  status: 'silently',
};

export const sampleWithFullData: IEmprestimo = {
  id: 9367,
  dataEmprestimo: dayjs('2025-01-23T23:46'),
  status: 'true whether',
};

export const sampleWithNewData: NewEmprestimo = {
  dataEmprestimo: dayjs('2025-01-24T10:09'),
  status: 'sauerkraut whose gah',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
