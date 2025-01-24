import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEstudante } from '../estudante.model';
import { EstudanteService } from '../service/estudante.service';

const estudanteResolve = (route: ActivatedRouteSnapshot): Observable<null | IEstudante> => {
  const id = route.params.id;
  if (id) {
    return inject(EstudanteService)
      .find(id)
      .pipe(
        mergeMap((estudante: HttpResponse<IEstudante>) => {
          if (estudante.body) {
            return of(estudante.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default estudanteResolve;
