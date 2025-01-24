import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IEmprestimo } from '../emprestimo.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../emprestimo.test-samples';

import { EmprestimoService, RestEmprestimo } from './emprestimo.service';

const requireRestSample: RestEmprestimo = {
  ...sampleWithRequiredData,
  dataEmprestimo: sampleWithRequiredData.dataEmprestimo?.toJSON(),
};

describe('Emprestimo Service', () => {
  let service: EmprestimoService;
  let httpMock: HttpTestingController;
  let expectedResult: IEmprestimo | IEmprestimo[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(EmprestimoService);
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

    it('should create a Emprestimo', () => {
      const emprestimo = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(emprestimo).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Emprestimo', () => {
      const emprestimo = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(emprestimo).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Emprestimo', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Emprestimo', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Emprestimo', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEmprestimoToCollectionIfMissing', () => {
      it('should add a Emprestimo to an empty array', () => {
        const emprestimo: IEmprestimo = sampleWithRequiredData;
        expectedResult = service.addEmprestimoToCollectionIfMissing([], emprestimo);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(emprestimo);
      });

      it('should not add a Emprestimo to an array that contains it', () => {
        const emprestimo: IEmprestimo = sampleWithRequiredData;
        const emprestimoCollection: IEmprestimo[] = [
          {
            ...emprestimo,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEmprestimoToCollectionIfMissing(emprestimoCollection, emprestimo);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Emprestimo to an array that doesn't contain it", () => {
        const emprestimo: IEmprestimo = sampleWithRequiredData;
        const emprestimoCollection: IEmprestimo[] = [sampleWithPartialData];
        expectedResult = service.addEmprestimoToCollectionIfMissing(emprestimoCollection, emprestimo);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(emprestimo);
      });

      it('should add only unique Emprestimo to an array', () => {
        const emprestimoArray: IEmprestimo[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const emprestimoCollection: IEmprestimo[] = [sampleWithRequiredData];
        expectedResult = service.addEmprestimoToCollectionIfMissing(emprestimoCollection, ...emprestimoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const emprestimo: IEmprestimo = sampleWithRequiredData;
        const emprestimo2: IEmprestimo = sampleWithPartialData;
        expectedResult = service.addEmprestimoToCollectionIfMissing([], emprestimo, emprestimo2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(emprestimo);
        expect(expectedResult).toContain(emprestimo2);
      });

      it('should accept null and undefined values', () => {
        const emprestimo: IEmprestimo = sampleWithRequiredData;
        expectedResult = service.addEmprestimoToCollectionIfMissing([], null, emprestimo, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(emprestimo);
      });

      it('should return initial array if no Emprestimo is added', () => {
        const emprestimoCollection: IEmprestimo[] = [sampleWithRequiredData];
        expectedResult = service.addEmprestimoToCollectionIfMissing(emprestimoCollection, undefined, null);
        expect(expectedResult).toEqual(emprestimoCollection);
      });
    });

    describe('compareEmprestimo', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEmprestimo(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 30317 };
        const entity2 = null;

        const compareResult1 = service.compareEmprestimo(entity1, entity2);
        const compareResult2 = service.compareEmprestimo(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 30317 };
        const entity2 = { id: 1225 };

        const compareResult1 = service.compareEmprestimo(entity1, entity2);
        const compareResult2 = service.compareEmprestimo(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 30317 };
        const entity2 = { id: 30317 };

        const compareResult1 = service.compareEmprestimo(entity1, entity2);
        const compareResult2 = service.compareEmprestimo(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
