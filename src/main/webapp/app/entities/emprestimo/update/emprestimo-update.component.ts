import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IEstudante } from 'app/entities/estudante/estudante.model';
import { EstudanteService } from 'app/entities/estudante/service/estudante.service';
import { ILivro } from 'app/entities/livro/livro.model';
import { LivroService } from 'app/entities/livro/service/livro.service';
import { EmprestimoService } from '../service/emprestimo.service';
import { IEmprestimo } from '../emprestimo.model';
import { EmprestimoFormGroup, EmprestimoFormService } from './emprestimo-form.service';

@Component({
  selector: 'jhi-emprestimo-update',
  templateUrl: './emprestimo-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class EmprestimoUpdateComponent implements OnInit {
  isSaving = false;
  emprestimo: IEmprestimo | null = null;

  estudantesSharedCollection: IEstudante[] = [];
  livrosSharedCollection: ILivro[] = [];

  protected emprestimoService = inject(EmprestimoService);
  protected emprestimoFormService = inject(EmprestimoFormService);
  protected estudanteService = inject(EstudanteService);
  protected livroService = inject(LivroService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: EmprestimoFormGroup = this.emprestimoFormService.createEmprestimoFormGroup();

  compareEstudante = (o1: IEstudante | null, o2: IEstudante | null): boolean => this.estudanteService.compareEstudante(o1, o2);

  compareLivro = (o1: ILivro | null, o2: ILivro | null): boolean => this.livroService.compareLivro(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ emprestimo }) => {
      this.emprestimo = emprestimo;
      if (emprestimo) {
        this.updateForm(emprestimo);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const emprestimo = this.emprestimoFormService.getEmprestimo(this.editForm);
    if (emprestimo.id !== null) {
      this.subscribeToSaveResponse(this.emprestimoService.update(emprestimo));
    } else {
      this.subscribeToSaveResponse(this.emprestimoService.create(emprestimo));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEmprestimo>>): void {
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

  protected updateForm(emprestimo: IEmprestimo): void {
    this.emprestimo = emprestimo;
    this.emprestimoFormService.resetForm(this.editForm, emprestimo);

    this.estudantesSharedCollection = this.estudanteService.addEstudanteToCollectionIfMissing<IEstudante>(
      this.estudantesSharedCollection,
      emprestimo.estudante,
    );
    this.livrosSharedCollection = this.livroService.addLivroToCollectionIfMissing<ILivro>(this.livrosSharedCollection, emprestimo.livro);
  }

  protected loadRelationshipsOptions(): void {
    this.estudanteService
      .query()
      .pipe(map((res: HttpResponse<IEstudante[]>) => res.body ?? []))
      .pipe(
        map((estudantes: IEstudante[]) =>
          this.estudanteService.addEstudanteToCollectionIfMissing<IEstudante>(estudantes, this.emprestimo?.estudante),
        ),
      )
      .subscribe((estudantes: IEstudante[]) => (this.estudantesSharedCollection = estudantes));

    this.livroService
      .query()
      .pipe(map((res: HttpResponse<ILivro[]>) => res.body ?? []))
      .pipe(map((livros: ILivro[]) => this.livroService.addLivroToCollectionIfMissing<ILivro>(livros, this.emprestimo?.livro)))
      .subscribe((livros: ILivro[]) => (this.livrosSharedCollection = livros));
  }
}
