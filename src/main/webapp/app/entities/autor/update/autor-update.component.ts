import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IAutor } from '../autor.model';
import { AutorService } from '../service/autor.service';
import { AutorFormGroup, AutorFormService } from './autor-form.service';

@Component({
  selector: 'jhi-autor-update',
  templateUrl: './autor-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AutorUpdateComponent implements OnInit {
  isSaving = false;
  autor: IAutor | null = null;

  protected autorService = inject(AutorService);
  protected autorFormService = inject(AutorFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: AutorFormGroup = this.autorFormService.createAutorFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ autor }) => {
      this.autor = autor;
      if (autor) {
        this.updateForm(autor);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const autor = this.autorFormService.getAutor(this.editForm);
    if (autor.id !== null) {
      this.subscribeToSaveResponse(this.autorService.update(autor));
    } else {
      this.subscribeToSaveResponse(this.autorService.create(autor));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAutor>>): void {
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

  protected updateForm(autor: IAutor): void {
    this.autor = autor;
    this.autorFormService.resetForm(this.editForm, autor);
  }
}
