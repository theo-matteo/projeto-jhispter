import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IEstudante } from '../estudante.model';
import { EstudanteService } from '../service/estudante.service';
import { EstudanteFormGroup, EstudanteFormService } from './estudante-form.service';

@Component({
  selector: 'jhi-estudante-update',
  templateUrl: './estudante-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class EstudanteUpdateComponent implements OnInit {
  isSaving = false;
  estudante: IEstudante | null = null;

  protected estudanteService = inject(EstudanteService);
  protected estudanteFormService = inject(EstudanteFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: EstudanteFormGroup = this.estudanteFormService.createEstudanteFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ estudante }) => {
      this.estudante = estudante;
      if (estudante) {
        this.updateForm(estudante);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const estudante = this.estudanteFormService.getEstudante(this.editForm);
    if (estudante.id !== null) {
      this.subscribeToSaveResponse(this.estudanteService.update(estudante));
    } else {
      this.subscribeToSaveResponse(this.estudanteService.create(estudante));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEstudante>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(estudante: IEstudante): void {
    this.estudante = estudante;
    this.estudanteFormService.resetForm(this.editForm, estudante);
  }
}
