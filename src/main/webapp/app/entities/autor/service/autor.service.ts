import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAutor, NewAutor } from '../autor.model';

export type PartialUpdateAutor = Partial<IAutor> & Pick<IAutor, 'id'>;

export type EntityResponseType = HttpResponse<IAutor>;
export type EntityArrayResponseType = HttpResponse<IAutor[]>;

@Injectable({ providedIn: 'root' })
export class AutorService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/autors');

  create(autor: NewAutor): Observable<EntityResponseType> {
    return this.http.post<IAutor>(this.resourceUrl, autor, { observe: 'response' });
  }

  update(autor: IAutor): Observable<EntityResponseType> {
    return this.http.put<IAutor>(`${this.resourceUrl}/${this.getAutorIdentifier(autor)}`, autor, { observe: 'response' });
  }

  partialUpdate(autor: PartialUpdateAutor): Observable<EntityResponseType> {
    return this.http.patch<IAutor>(`${this.resourceUrl}/${this.getAutorIdentifier(autor)}`, autor, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAutor>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAutor[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAutorIdentifier(autor: Pick<IAutor, 'id'>): number {
    return autor.id;
  }

  compareAutor(o1: Pick<IAutor, 'id'> | null, o2: Pick<IAutor, 'id'> | null): boolean {
    return o1 && o2 ? this.getAutorIdentifier(o1) === this.getAutorIdentifier(o2) : o1 === o2;
  }

  addAutorToCollectionIfMissing<Type extends Pick<IAutor, 'id'>>(
    autorCollection: Type[],
    ...autorsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const autors: Type[] = autorsToCheck.filter(isPresent);
    if (autors.length > 0) {
      const autorCollectionIdentifiers = autorCollection.map(autorItem => this.getAutorIdentifier(autorItem));
      const autorsToAdd = autors.filter(autorItem => {
        const autorIdentifier = this.getAutorIdentifier(autorItem);
        if (autorCollectionIdentifiers.includes(autorIdentifier)) {
          return false;
        }
        autorCollectionIdentifiers.push(autorIdentifier);
        return true;
      });
      return [...autorsToAdd, ...autorCollection];
    }
    return autorCollection;
  }
}
