import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEmprestimo } from '../emprestimo.model';
import { EmprestimoService } from '../service/emprestimo.service';

const emprestimoResolve = (route: ActivatedRouteSnapshot): Observable<null | IEmprestimo> => {
  const id = route.params.id;
  if (id) {
    return inject(EmprestimoService)
      .find(id)
      .pipe(
        mergeMap((emprestimo: HttpResponse<IEmprestimo>) => {
          if (emprestimo.body) {
            return of(emprestimo.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default emprestimoResolve;
