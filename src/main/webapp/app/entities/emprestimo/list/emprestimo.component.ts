import { Component, NgZone, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { Observable, Subscription, combineLatest, filter, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { SortByDirective, SortDirective, SortService, type SortState, sortStateSignal } from 'app/shared/sort';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { DEFAULT_SORT_DATA, ITEM_DELETED_EVENT, SORT } from 'app/config/navigation.constants';
import { IEmprestimo } from '../emprestimo.model';
import { EmprestimoService, EntityArrayResponseType } from '../service/emprestimo.service';
import { EmprestimoDeleteDialogComponent } from '../delete/emprestimo-delete-dialog.component';
import { EstudanteService } from 'app/entities/estudante/service/estudante.service';
import { LivroService } from 'app/entities/livro/service/livro.service';

@Component({
  selector: 'jhi-emprestimo',
  templateUrl: './emprestimo.component.html',
  imports: [RouterModule, FormsModule, SharedModule, SortDirective, SortByDirective, FormatMediumDatetimePipe],
})
export class EmprestimoComponent implements OnInit {
  subscription: Subscription | null = null;
  emprestimos = signal<IEmprestimo[]>([]);
  isLoading = false;

  // Map de estudantes e livros
  estudantesMap = new Map<number, string>();
  livrosMap = new Map<number, string>();

  // Texto do filtro
  filterText = '';
  filterBy = 'estudante';

  sortState = sortStateSignal({});

  public readonly router = inject(Router);
  protected readonly emprestimoService = inject(EmprestimoService);
  protected readonly estudanteService = inject(EstudanteService);
  protected readonly livroService = inject(LivroService);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);

  trackId = (item: IEmprestimo): number => this.emprestimoService.getEmprestimoIdentifier(item);

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => {
          if (this.emprestimos().length === 0) {
            this.load();
          } else {
            this.emprestimos.set(this.refineData(this.emprestimos()));
          }
        }),
      )
      .subscribe();
  }

  delete(emprestimo: IEmprestimo): void {
    const modalRef = this.modalService.open(EmprestimoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.emprestimo = emprestimo;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        tap(() => this.load()),
      )
      .subscribe();
  }

  applyFilter(): void {
    if (this.filterText.trim() === '') {
      this.load();
    } else {
      this.emprestimos.set(
        this.emprestimos().filter(emprestimo => {
          const estudanteName = this.estudantesMap.get(emprestimo.estudante!.id);
          const livroTitle = this.livrosMap.get(emprestimo.livro!.id);
          return (
            (estudanteName?.toLowerCase().includes(this.filterText.toLowerCase()) ?? false) ||
            (livroTitle?.toLowerCase().includes(this.filterText.toLowerCase()) ?? false)
          );
        }),
      );
    }
  }

  load(): void {
    this.queryBackend().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(event: SortState): void {
    this.handleNavigation(event);
  }

  loadEstudanteName(estudanteId: number): void {
    if (!this.estudantesMap.has(estudanteId)) {
      this.estudanteService.find(estudanteId).subscribe({
        next: response => {
          const estudante = response.body;
          if (estudante) {
            this.estudantesMap.set(estudanteId, estudante.nomeEstudante!);
          }
        },
        error: () => {
          this.estudantesMap.set(estudanteId, 'Nome não encontrado');
        },
      });
    }
  }

  loadLivroName(livroId: number): void {
    if (!this.livrosMap.has(livroId)) {
      this.livroService.find(livroId).subscribe({
        next: response => {
          const livro = response.body;
          if (livro) {
            this.livrosMap.set(livroId, livro.titulo!); // Supondo que o título do livro seja o campo 'titulo'
          }
        },
        error: () => {
          this.livrosMap.set(livroId, 'Título não encontrado');
        },
      });
    }
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data[DEFAULT_SORT_DATA]));
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.emprestimos.set(this.refineData(dataFromBody));

    // Obtem o nome dos estudantes para exibir na tabela
    this.emprestimos().forEach(emprestimo => {
      if (emprestimo.estudante) {
        this.loadEstudanteName(emprestimo.estudante.id);
        this.loadLivroName(emprestimo.livro!.id);
      }
    });
  }

  protected refineData(data: IEmprestimo[]): IEmprestimo[] {
    const { predicate, order } = this.sortState();
    return predicate && order ? data.sort(this.sortService.startSort({ predicate, order })) : data;
  }

  protected fillComponentAttributesFromResponseBody(data: IEmprestimo[] | null): IEmprestimo[] {
    return data ?? [];
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.emprestimoService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(sortState: SortState): void {
    const queryParamsObj = {
      sort: this.sortService.buildSortParam(sortState),
    };

    this.ngZone.run(() => {
      this.router.navigate(['./'], {
        relativeTo: this.activatedRoute,
        queryParams: queryParamsObj,
      });
    });
  }
}
