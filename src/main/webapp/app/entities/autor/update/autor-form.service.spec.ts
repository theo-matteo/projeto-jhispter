import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../autor.test-samples';

import { AutorFormService } from './autor-form.service';

describe('Autor Form Service', () => {
  let service: AutorFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutorFormService);
  });

  describe('Service methods', () => {
    describe('createAutorFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAutorFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nomeAutor: expect.any(Object),
          }),
        );
      });

      it('passing IAutor should create a new form with FormGroup', () => {
        const formGroup = service.createAutorFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nomeAutor: expect.any(Object),
          }),
        );
      });
    });

    describe('getAutor', () => {
      it('should return NewAutor for default Autor initial value', () => {
        const formGroup = service.createAutorFormGroup(sampleWithNewData);

        const autor = service.getAutor(formGroup) as any;

        expect(autor).toMatchObject(sampleWithNewData);
      });

      it('should return NewAutor for empty Autor initial value', () => {
        const formGroup = service.createAutorFormGroup();

        const autor = service.getAutor(formGroup) as any;

        expect(autor).toMatchObject({});
      });

      it('should return IAutor', () => {
        const formGroup = service.createAutorFormGroup(sampleWithRequiredData);

        const autor = service.getAutor(formGroup) as any;

        expect(autor).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAutor should not enable id FormControl', () => {
        const formGroup = service.createAutorFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAutor should disable id FormControl', () => {
        const formGroup = service.createAutorFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
