import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ILivro } from '../livro.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../livro.test-samples';

import { LivroService } from './livro.service';

const requireRestSample: ILivro = {
  ...sampleWithRequiredData,
};

describe('Livro Service', () => {
  let service: LivroService;
  let httpMock: HttpTestingController;
  let expectedResult: ILivro | ILivro[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(LivroService);
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

    it('should create a Livro', () => {
      const livro = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(livro).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Livro', () => {
      const livro = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(livro).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Livro', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Livro', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Livro', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addLivroToCollectionIfMissing', () => {
      it('should add a Livro to an empty array', () => {
        const livro: ILivro = sampleWithRequiredData;
        expectedResult = service.addLivroToCollectionIfMissing([], livro);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(livro);
      });

      it('should not add a Livro to an array that contains it', () => {
        const livro: ILivro = sampleWithRequiredData;
        const livroCollection: ILivro[] = [
          {
            ...livro,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addLivroToCollectionIfMissing(livroCollection, livro);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Livro to an array that doesn't contain it", () => {
        const livro: ILivro = sampleWithRequiredData;
        const livroCollection: ILivro[] = [sampleWithPartialData];
        expectedResult = service.addLivroToCollectionIfMissing(livroCollection, livro);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(livro);
      });

      it('should add only unique Livro to an array', () => {
        const livroArray: ILivro[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const livroCollection: ILivro[] = [sampleWithRequiredData];
        expectedResult = service.addLivroToCollectionIfMissing(livroCollection, ...livroArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const livro: ILivro = sampleWithRequiredData;
        const livro2: ILivro = sampleWithPartialData;
        expectedResult = service.addLivroToCollectionIfMissing([], livro, livro2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(livro);
        expect(expectedResult).toContain(livro2);
      });

      it('should accept null and undefined values', () => {
        const livro: ILivro = sampleWithRequiredData;
        expectedResult = service.addLivroToCollectionIfMissing([], null, livro, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(livro);
      });

      it('should return initial array if no Livro is added', () => {
        const livroCollection: ILivro[] = [sampleWithRequiredData];
        expectedResult = service.addLivroToCollectionIfMissing(livroCollection, undefined, null);
        expect(expectedResult).toEqual(livroCollection);
      });
    });

    describe('compareLivro', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareLivro(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 16172 };
        const entity2 = null;

        const compareResult1 = service.compareLivro(entity1, entity2);
        const compareResult2 = service.compareLivro(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 16172 };
        const entity2 = { id: 26070 };

        const compareResult1 = service.compareLivro(entity1, entity2);
        const compareResult2 = service.compareLivro(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 16172 };
        const entity2 = { id: 16172 };

        const compareResult1 = service.compareLivro(entity1, entity2);
        const compareResult2 = service.compareLivro(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
