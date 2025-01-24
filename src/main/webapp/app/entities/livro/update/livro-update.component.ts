import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IAutor } from 'app/entities/autor/autor.model';
import { AutorService } from 'app/entities/autor/service/autor.service';
import { ILivro } from '../livro.model';
import { LivroService } from '../service/livro.service';
import { LivroFormGroup, LivroFormService } from './livro-form.service';

@Component({
  selector: 'jhi-livro-update',
  templateUrl: './livro-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class LivroUpdateComponent implements OnInit {
  isSaving = false;
  livro: ILivro | null = null;

  autorsSharedCollection: IAutor[] = [];

  protected livroService = inject(LivroService);
  protected livroFormService = inject(LivroFormService);
  protected autorService = inject(AutorService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: LivroFormGroup = this.livroFormService.createLivroFormGroup();

  compareAutor = (o1: IAutor | null, o2: IAutor | null): boolean => this.autorService.compareAutor(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ livro }) => {
      this.livro = livro;
      if (livro) {
        this.updateForm(livro);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const livro = this.livroFormService.getLivro(this.editForm);
    if (livro.id !== null) {
      this.subscribeToSaveResponse(this.livroService.update(livro));
    } else {
      this.subscribeToSaveResponse(this.livroService.create(livro));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILivro>>): void {
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

  protected updateForm(livro: ILivro): void {
    this.livro = livro;
    this.livroFormService.resetForm(this.editForm, livro);

    this.autorsSharedCollection = this.autorService.addAutorToCollectionIfMissing<IAutor>(this.autorsSharedCollection, livro.autor);
  }

  protected loadRelationshipsOptions(): void {
    this.autorService
      .query()
      .pipe(map((res: HttpResponse<IAutor[]>) => res.body ?? []))
      .pipe(map((autors: IAutor[]) => this.autorService.addAutorToCollectionIfMissing<IAutor>(autors, this.livro?.autor)))
      .subscribe((autors: IAutor[]) => (this.autorsSharedCollection = autors));
  }
}
