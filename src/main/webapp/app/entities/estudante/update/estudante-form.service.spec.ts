import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../estudante.test-samples';

import { EstudanteFormService } from './estudante-form.service';

describe('Estudante Form Service', () => {
  let service: EstudanteFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstudanteFormService);
  });

  describe('Service methods', () => {
    describe('createEstudanteFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEstudanteFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nomeEstudante: expect.any(Object),
            email: expect.any(Object),
            telefone: expect.any(Object),
          }),
        );
      });

      it('passing IEstudante should create a new form with FormGroup', () => {
        const formGroup = service.createEstudanteFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nomeEstudante: expect.any(Object),
            email: expect.any(Object),
            telefone: expect.any(Object),
          }),
        );
      });
    });

    describe('getEstudante', () => {
      it('should return NewEstudante for default Estudante initial value', () => {
        const formGroup = service.createEstudanteFormGroup(sampleWithNewData);

        const estudante = service.getEstudante(formGroup) as any;

        expect(estudante).toMatchObject(sampleWithNewData);
      });

      it('should return NewEstudante for empty Estudante initial value', () => {
        const formGroup = service.createEstudanteFormGroup();

        const estudante = service.getEstudante(formGroup) as any;

        expect(estudante).toMatchObject({});
      });

      it('should return IEstudante', () => {
        const formGroup = service.createEstudanteFormGroup(sampleWithRequiredData);

        const estudante = service.getEstudante(formGroup) as any;

        expect(estudante).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEstudante should not enable id FormControl', () => {
        const formGroup = service.createEstudanteFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEstudante should disable id FormControl', () => {
        const formGroup = service.createEstudanteFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
