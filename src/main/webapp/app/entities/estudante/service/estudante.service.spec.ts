import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IEstudante } from '../estudante.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../estudante.test-samples';

import { EstudanteService } from './estudante.service';

const requireRestSample: IEstudante = {
  ...sampleWithRequiredData,
};

describe('Estudante Service', () => {
  let service: EstudanteService;
  let httpMock: HttpTestingController;
  let expectedResult: IEstudante | IEstudante[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(EstudanteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Estudante', () => {
      const estudante = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(estudante).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Estudante', () => {
      const estudante = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(estudante).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Estudante', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Estudante', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Estudante', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEstudanteToCollectionIfMissing', () => {
      it('should add a Estudante to an empty array', () => {
        const estudante: IEstudante = sampleWithRequiredData;
        expectedResult = service.addEstudanteToCollectionIfMissing([], estudante);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(estudante);
      });

      it('should not add a Estudante to an array that contains it', () => {
        const estudante: IEstudante = sampleWithRequiredData;
        const estudanteCollection: IEstudante[] = [
          {
            ...estudante,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEstudanteToCollectionIfMissing(estudanteCollection, estudante);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Estudante to an array that doesn't contain it", () => {
        const estudante: IEstudante = sampleWithRequiredData;
        const estudanteCollection: IEstudante[] = [sampleWithPartialData];
        expectedResult = service.addEstudanteToCollectionIfMissing(estudanteCollection, estudante);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(estudante);
      });

      it('should add only unique Estudante to an array', () => {
        const estudanteArray: IEstudante[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const estudanteCollection: IEstudante[] = [sampleWithRequiredData];
        expectedResult = service.addEstudanteToCollectionIfMissing(estudanteCollection, ...estudanteArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const estudante: IEstudante = sampleWithRequiredData;
        const estudante2: IEstudante = sampleWithPartialData;
        expectedResult = service.addEstudanteToCollectionIfMissing([], estudante, estudante2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(estudante);
        expect(expectedResult).toContain(estudante2);
      });

      it('should accept null and undefined values', () => {
        const estudante: IEstudante = sampleWithRequiredData;
        expectedResult = service.addEstudanteToCollectionIfMissing([], null, estudante, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(estudante);
      });

      it('should return initial array if no Estudante is added', () => {
        const estudanteCollection: IEstudante[] = [sampleWithRequiredData];
        expectedResult = service.addEstudanteToCollectionIfMissing(estudanteCollection, undefined, null);
        expect(expectedResult).toEqual(estudanteCollection);
      });
    });

    describe('compareEstudante', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEstudante(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 19416 };
        const entity2 = null;

        const compareResult1 = service.compareEstudante(entity1, entity2);
        const compareResult2 = service.compareEstudante(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 19416 };
        const entity2 = { id: 1629 };

        const compareResult1 = service.compareEstudante(entity1, entity2);
        const compareResult2 = service.compareEstudante(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 19416 };
        const entity2 = { id: 19416 };

        const compareResult1 = service.compareEstudante(entity1, entity2);
        const compareResult2 = service.compareEstudante(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
