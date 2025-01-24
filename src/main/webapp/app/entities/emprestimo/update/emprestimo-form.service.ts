import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEmprestimo, NewEmprestimo } from '../emprestimo.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEmprestimo for edit and NewEmprestimoFormGroupInput for create.
 */
type EmprestimoFormGroupInput = IEmprestimo | PartialWithRequiredKeyOf<NewEmprestimo>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IEmprestimo | NewEmprestimo> = Omit<T, 'dataEmprestimo'> & {
  dataEmprestimo?: string | null;
};

type EmprestimoFormRawValue = FormValueOf<IEmprestimo>;

type NewEmprestimoFormRawValue = FormValueOf<NewEmprestimo>;

type EmprestimoFormDefaults = Pick<NewEmprestimo, 'id' | 'dataEmprestimo'>;

type EmprestimoFormGroupContent = {
  id: FormControl<EmprestimoFormRawValue['id'] | NewEmprestimo['id']>;
  dataEmprestimo: FormControl<EmprestimoFormRawValue['dataEmprestimo']>;
  status: FormControl<EmprestimoFormRawValue['status']>;
  estudante: FormControl<EmprestimoFormRawValue['estudante']>;
  livro: FormControl<EmprestimoFormRawValue['livro']>;
};

export type EmprestimoFormGroup = FormGroup<EmprestimoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EmprestimoFormService {
  createEmprestimoFormGroup(emprestimo: EmprestimoFormGroupInput = { id: null }): EmprestimoFormGroup {
    const emprestimoRawValue = this.convertEmprestimoToEmprestimoRawValue({
      ...this.getFormDefaults(),
      ...emprestimo,
    });
    return new FormGroup<EmprestimoFormGroupContent>({
      id: new FormControl(
        { value: emprestimoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      dataEmprestimo: new FormControl(emprestimoRawValue.dataEmprestimo, {
        validators: [Validators.required],
      }),
      status: new FormControl(emprestimoRawValue.status, {
        validators: [Validators.required],
      }),
      estudante: new FormControl(emprestimoRawValue.estudante),
      livro: new FormControl(emprestimoRawValue.livro),
    });
  }

  getEmprestimo(form: EmprestimoFormGroup): IEmprestimo | NewEmprestimo {
    return this.convertEmprestimoRawValueToEmprestimo(form.getRawValue() as EmprestimoFormRawValue | NewEmprestimoFormRawValue);
  }

  resetForm(form: EmprestimoFormGroup, emprestimo: EmprestimoFormGroupInput): void {
    const emprestimoRawValue = this.convertEmprestimoToEmprestimoRawValue({ ...this.getFormDefaults(), ...emprestimo });
    form.reset(
      {
        ...emprestimoRawValue,
        id: { value: emprestimoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): EmprestimoFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dataEmprestimo: currentTime,
    };
  }

  private convertEmprestimoRawValueToEmprestimo(
    rawEmprestimo: EmprestimoFormRawValue | NewEmprestimoFormRawValue,
  ): IEmprestimo | NewEmprestimo {
    return {
      ...rawEmprestimo,
      dataEmprestimo: dayjs(rawEmprestimo.dataEmprestimo, DATE_TIME_FORMAT),
    };
  }

  private convertEmprestimoToEmprestimoRawValue(
    emprestimo: IEmprestimo | (Partial<NewEmprestimo> & EmprestimoFormDefaults),
  ): EmprestimoFormRawValue | PartialWithRequiredKeyOf<NewEmprestimoFormRawValue> {
    return {
      ...emprestimo,
      dataEmprestimo: emprestimo.dataEmprestimo ? emprestimo.dataEmprestimo.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
