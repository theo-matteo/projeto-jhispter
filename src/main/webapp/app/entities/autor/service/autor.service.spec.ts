import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IAutor } from '../autor.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../autor.test-samples';

import { AutorService } from './autor.service';

const requireRestSample: IAutor = {
  ...sampleWithRequiredData,
};

describe('Autor Service', () => {
  let service: AutorService;
  let httpMock: HttpTestingController;
  let expectedResult: IAutor | IAutor[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(AutorService);
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

    it('should create a Autor', () => {
      const autor = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(autor).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Autor', () => {
      const autor = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(autor).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Autor', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Autor', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Autor', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAutorToCollectionIfMissing', () => {
      it('should add a Autor to an empty array', () => {
        const autor: IAutor = sampleWithRequiredData;
        expectedResult = service.addAutorToCollectionIfMissing([], autor);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(autor);
      });

      it('should not add a Autor to an array that contains it', () => {
        const autor: IAutor = sampleWithRequiredData;
        const autorCollection: IAutor[] = [
          {
            ...autor,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAutorToCollectionIfMissing(autorCollection, autor);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Autor to an array that doesn't contain it", () => {
        const autor: IAutor = sampleWithRequiredData;
        const autorCollection: IAutor[] = [sampleWithPartialData];
        expectedResult = service.addAutorToCollectionIfMissing(autorCollection, autor);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(autor);
      });

      it('should add only unique Autor to an array', () => {
        const autorArray: IAutor[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const autorCollection: IAutor[] = [sampleWithRequiredData];
        expectedResult = service.addAutorToCollectionIfMissing(autorCollection, ...autorArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const autor: IAutor = sampleWithRequiredData;
        const autor2: IAutor = sampleWithPartialData;
        expectedResult = service.addAutorToCollectionIfMissing([], autor, autor2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(autor);
        expect(expectedResult).toContain(autor2);
      });

      it('should accept null and undefined values', () => {
        const autor: IAutor = sampleWithRequiredData;
        expectedResult = service.addAutorToCollectionIfMissing([], null, autor, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(autor);
      });

      it('should return initial array if no Autor is added', () => {
        const autorCollection: IAutor[] = [sampleWithRequiredData];
        expectedResult = service.addAutorToCollectionIfMissing(autorCollection, undefined, null);
        expect(expectedResult).toEqual(autorCollection);
      });
    });

    describe('compareAutor', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAutor(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 29313 };
        const entity2 = null;

        const compareResult1 = service.compareAutor(entity1, entity2);
        const compareResult2 = service.compareAutor(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 29313 };
        const entity2 = { id: 27814 };

        const compareResult1 = service.compareAutor(entity1, entity2);
        const compareResult2 = service.compareAutor(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 29313 };
        const entity2 = { id: 29313 };

        const compareResult1 = service.compareAutor(entity1, entity2);
        const compareResult2 = service.compareAutor(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
