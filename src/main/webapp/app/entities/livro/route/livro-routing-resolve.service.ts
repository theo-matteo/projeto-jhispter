import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILivro } from '../livro.model';
import { LivroService } from '../service/livro.service';

const livroResolve = (route: ActivatedRouteSnapshot): Observable<null | ILivro> => {
  const id = route.params.id;
  if (id) {
    return inject(LivroService)
      .find(id)
      .pipe(
        mergeMap((livro: HttpResponse<ILivro>) => {
          if (livro.body) {
            return of(livro.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default livroResolve;
