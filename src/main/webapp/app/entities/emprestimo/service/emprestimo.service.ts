import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEmprestimo, NewEmprestimo } from '../emprestimo.model';

export type PartialUpdateEmprestimo = Partial<IEmprestimo> & Pick<IEmprestimo, 'id'>;

type RestOf<T extends IEmprestimo | NewEmprestimo> = Omit<T, 'dataEmprestimo'> & {
  dataEmprestimo?: string | null;
};

export type RestEmprestimo = RestOf<IEmprestimo>;

export type NewRestEmprestimo = RestOf<NewEmprestimo>;

export type PartialUpdateRestEmprestimo = RestOf<PartialUpdateEmprestimo>;

export type EntityResponseType = HttpResponse<IEmprestimo>;
export type EntityArrayResponseType = HttpResponse<IEmprestimo[]>;

@Injectable({ providedIn: 'root' })
export class EmprestimoService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/emprestimos');

  create(emprestimo: NewEmprestimo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(emprestimo);
    return this.http
      .post<RestEmprestimo>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(emprestimo: IEmprestimo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(emprestimo);
    return this.http
      .put<RestEmprestimo>(`${this.resourceUrl}/${this.getEmprestimoIdentifier(emprestimo)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(emprestimo: PartialUpdateEmprestimo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(emprestimo);
    return this.http
      .patch<RestEmprestimo>(`${this.resourceUrl}/${this.getEmprestimoIdentifier(emprestimo)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestEmprestimo>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestEmprestimo[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEmprestimoIdentifier(emprestimo: Pick<IEmprestimo, 'id'>): number {
    return emprestimo.id;
  }

  compareEmprestimo(o1: Pick<IEmprestimo, 'id'> | null, o2: Pick<IEmprestimo, 'id'> | null): boolean {
    return o1 && o2 ? this.getEmprestimoIdentifier(o1) === this.getEmprestimoIdentifier(o2) : o1 === o2;
  }

  addEmprestimoToCollectionIfMissing<Type extends Pick<IEmprestimo, 'id'>>(
    emprestimoCollection: Type[],
    ...emprestimosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const emprestimos: Type[] = emprestimosToCheck.filter(isPresent);
    if (emprestimos.length > 0) {
      const emprestimoCollectionIdentifiers = emprestimoCollection.map(emprestimoItem => this.getEmprestimoIdentifier(emprestimoItem));
      const emprestimosToAdd = emprestimos.filter(emprestimoItem => {
        const emprestimoIdentifier = this.getEmprestimoIdentifier(emprestimoItem);
        if (emprestimoCollectionIdentifiers.includes(emprestimoIdentifier)) {
          return false;
        }
        emprestimoCollectionIdentifiers.push(emprestimoIdentifier);
        return true;
      });
      return [...emprestimosToAdd, ...emprestimoCollection];
    }
    return emprestimoCollection;
  }

  protected convertDateFromClient<T extends IEmprestimo | NewEmprestimo | PartialUpdateEmprestimo>(emprestimo: T): RestOf<T> {
    return {
      ...emprestimo,
      dataEmprestimo: emprestimo.dataEmprestimo?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restEmprestimo: RestEmprestimo): IEmprestimo {
    return {
      ...restEmprestimo,
      dataEmprestimo: restEmprestimo.dataEmprestimo ? dayjs(restEmprestimo.dataEmprestimo) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestEmprestimo>): HttpResponse<IEmprestimo> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestEmprestimo[]>): HttpResponse<IEmprestimo[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
