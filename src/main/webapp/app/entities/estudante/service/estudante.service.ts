import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEstudante, NewEstudante } from '../estudante.model';

export type PartialUpdateEstudante = Partial<IEstudante> & Pick<IEstudante, 'id'>;

export type EntityResponseType = HttpResponse<IEstudante>;
export type EntityArrayResponseType = HttpResponse<IEstudante[]>;

@Injectable({ providedIn: 'root' })
export class EstudanteService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/estudantes');

  create(estudante: NewEstudante): Observable<EntityResponseType> {
    return this.http.post<IEstudante>(this.resourceUrl, estudante, { observe: 'response' });
  }

  update(estudante: IEstudante): Observable<EntityResponseType> {
    return this.http.put<IEstudante>(`${this.resourceUrl}/${this.getEstudanteIdentifier(estudante)}`, estudante, { observe: 'response' });
  }

  partialUpdate(estudante: PartialUpdateEstudante): Observable<EntityResponseType> {
    return this.http.patch<IEstudante>(`${this.resourceUrl}/${this.getEstudanteIdentifier(estudante)}`, estudante, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEstudante>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEstudante[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEstudanteIdentifier(estudante: Pick<IEstudante, 'id'>): number {
    return estudante.id;
  }

  compareEstudante(o1: Pick<IEstudante, 'id'> | null, o2: Pick<IEstudante, 'id'> | null): boolean {
    return o1 && o2 ? this.getEstudanteIdentifier(o1) === this.getEstudanteIdentifier(o2) : o1 === o2;
  }

  addEstudanteToCollectionIfMissing<Type extends Pick<IEstudante, 'id'>>(
    estudanteCollection: Type[],
    ...estudantesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const estudantes: Type[] = estudantesToCheck.filter(isPresent);
    if (estudantes.length > 0) {
      const estudanteCollectionIdentifiers = estudanteCollection.map(estudanteItem => this.getEstudanteIdentifier(estudanteItem));
      const estudantesToAdd = estudantes.filter(estudanteItem => {
        const estudanteIdentifier = this.getEstudanteIdentifier(estudanteItem);
        if (estudanteCollectionIdentifiers.includes(estudanteIdentifier)) {
          return false;
        }
        estudanteCollectionIdentifiers.push(estudanteIdentifier);
        return true;
      });
      return [...estudantesToAdd, ...estudanteCollection];
    }
    return estudanteCollection;
  }
}
