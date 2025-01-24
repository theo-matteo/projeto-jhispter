import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ILivro, NewLivro } from '../livro.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILivro for edit and NewLivroFormGroupInput for create.
 */
type LivroFormGroupInput = ILivro | PartialWithRequiredKeyOf<NewLivro>;

type LivroFormDefaults = Pick<NewLivro, 'id'>;

type LivroFormGroupContent = {
  id: FormControl<ILivro['id'] | NewLivro['id']>;
  titulo: FormControl<ILivro['titulo']>;
  quantidade: FormControl<ILivro['quantidade']>;
  autor: FormControl<ILivro['autor']>;
};

export type LivroFormGroup = FormGroup<LivroFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LivroFormService {
  createLivroFormGroup(livro: LivroFormGroupInput = { id: null }): LivroFormGroup {
    const livroRawValue = {
      ...this.getFormDefaults(),
      ...livro,
    };
    return new FormGroup<LivroFormGroupContent>({
      id: new FormControl(
        { value: livroRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      titulo: new FormControl(livroRawValue.titulo, {
        validators: [Validators.required],
      }),
      quantidade: new FormControl(livroRawValue.quantidade, {
        validators: [Validators.required],
      }),
      autor: new FormControl(livroRawValue.autor),
    });
  }

  getLivro(form: LivroFormGroup): ILivro | NewLivro {
    return form.getRawValue() as ILivro | NewLivro;
  }

  resetForm(form: LivroFormGroup, livro: LivroFormGroupInput): void {
    const livroRawValue = { ...this.getFormDefaults(), ...livro };
    form.reset(
      {
        ...livroRawValue,
        id: { value: livroRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): LivroFormDefaults {
    return {
      id: null,
    };
  }
}
