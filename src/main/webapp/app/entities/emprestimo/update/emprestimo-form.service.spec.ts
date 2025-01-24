import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../emprestimo.test-samples';

import { EmprestimoFormService } from './emprestimo-form.service';

describe('Emprestimo Form Service', () => {
  let service: EmprestimoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmprestimoFormService);
  });

  describe('Service methods', () => {
    describe('createEmprestimoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEmprestimoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dataEmprestimo: expect.any(Object),
            status: expect.any(Object),
            estudante: expect.any(Object),
            livro: expect.any(Object),
          }),
        );
      });

      it('passing IEmprestimo should create a new form with FormGroup', () => {
        const formGroup = service.createEmprestimoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dataEmprestimo: expect.any(Object),
            status: expect.any(Object),
            estudante: expect.any(Object),
            livro: expect.any(Object),
          }),
        );
      });
    });

    describe('getEmprestimo', () => {
      it('should return NewEmprestimo for default Emprestimo initial value', () => {
        const formGroup = service.createEmprestimoFormGroup(sampleWithNewData);

        const emprestimo = service.getEmprestimo(formGroup) as any;

        expect(emprestimo).toMatchObject(sampleWithNewData);
      });

      it('should return NewEmprestimo for empty Emprestimo initial value', () => {
        const formGroup = service.createEmprestimoFormGroup();

        const emprestimo = service.getEmprestimo(formGroup) as any;

        expect(emprestimo).toMatchObject({});
      });

      it('should return IEmprestimo', () => {
        const formGroup = service.createEmprestimoFormGroup(sampleWithRequiredData);

        const emprestimo = service.getEmprestimo(formGroup) as any;

        expect(emprestimo).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEmprestimo should not enable id FormControl', () => {
        const formGroup = service.createEmprestimoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEmprestimo should disable id FormControl', () => {
        const formGroup = service.createEmprestimoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
