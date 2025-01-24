import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../livro.test-samples';

import { LivroFormService } from './livro-form.service';

describe('Livro Form Service', () => {
  let service: LivroFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LivroFormService);
  });

  describe('Service methods', () => {
    describe('createLivroFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLivroFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            titulo: expect.any(Object),
            quantidade: expect.any(Object),
            autor: expect.any(Object),
          }),
        );
      });

      it('passing ILivro should create a new form with FormGroup', () => {
        const formGroup = service.createLivroFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            titulo: expect.any(Object),
            quantidade: expect.any(Object),
            autor: expect.any(Object),
          }),
        );
      });
    });

    describe('getLivro', () => {
      it('should return NewLivro for default Livro initial value', () => {
        const formGroup = service.createLivroFormGroup(sampleWithNewData);

        const livro = service.getLivro(formGroup) as any;

        expect(livro).toMatchObject(sampleWithNewData);
      });

      it('should return NewLivro for empty Livro initial value', () => {
        const formGroup = service.createLivroFormGroup();

        const livro = service.getLivro(formGroup) as any;

        expect(livro).toMatchObject({});
      });

      it('should return ILivro', () => {
        const formGroup = service.createLivroFormGroup(sampleWithRequiredData);

        const livro = service.getLivro(formGroup) as any;

        expect(livro).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILivro should not enable id FormControl', () => {
        const formGroup = service.createLivroFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLivro should disable id FormControl', () => {
        const formGroup = service.createLivroFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
