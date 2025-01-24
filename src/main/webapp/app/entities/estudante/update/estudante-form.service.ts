import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IEstudante, NewEstudante } from '../estudante.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEstudante for edit and NewEstudanteFormGroupInput for create.
 */
type EstudanteFormGroupInput = IEstudante | PartialWithRequiredKeyOf<NewEstudante>;

type EstudanteFormDefaults = Pick<NewEstudante, 'id'>;

type EstudanteFormGroupContent = {
  id: FormControl<IEstudante['id'] | NewEstudante['id']>;
  nomeEstudante: FormControl<IEstudante['nomeEstudante']>;
  email: FormControl<IEstudante['email']>;
  telefone: FormControl<IEstudante['telefone']>;
};

export type EstudanteFormGroup = FormGroup<EstudanteFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EstudanteFormService {
  createEstudanteFormGroup(estudante: EstudanteFormGroupInput = { id: null }): EstudanteFormGroup {
    const estudanteRawValue = {
      ...this.getFormDefaults(),
      ...estudante,
    };
    return new FormGroup<EstudanteFormGroupContent>({
      id: new FormControl(
        { value: estudanteRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nomeEstudante: new FormControl(estudanteRawValue.nomeEstudante, {
        validators: [Validators.required],
      }),
      email: new FormControl(estudanteRawValue.email, {
        validators: [Validators.required],
      }),
      telefone: new FormControl(estudanteRawValue.telefone, {
        validators: [Validators.required],
      }),
    });
  }

  getEstudante(form: EstudanteFormGroup): IEstudante | NewEstudante {
    return form.getRawValue() as IEstudante | NewEstudante;
  }

  resetForm(form: EstudanteFormGroup, estudante: EstudanteFormGroupInput): void {
    const estudanteRawValue = { ...this.getFormDefaults(), ...estudante };
    form.reset(
      {
        ...estudanteRawValue,
        id: { value: estudanteRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): EstudanteFormDefaults {
    return {
      id: null,
    };
  }
}
