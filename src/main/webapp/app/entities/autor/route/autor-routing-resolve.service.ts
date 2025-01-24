import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAutor } from '../autor.model';
import { AutorService } from '../service/autor.service';

const autorResolve = (route: ActivatedRouteSnapshot): Observable<null | IAutor> => {
  const id = route.params.id;
  if (id) {
    return inject(AutorService)
      .find(id)
      .pipe(
        mergeMap((autor: HttpResponse<IAutor>) => {
          if (autor.body) {
            return of(autor.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default autorResolve;
