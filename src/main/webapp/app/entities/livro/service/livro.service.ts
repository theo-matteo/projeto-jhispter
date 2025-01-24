import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILivro, NewLivro } from '../livro.model';

export type PartialUpdateLivro = Partial<ILivro> & Pick<ILivro, 'id'>;

export type EntityResponseType = HttpResponse<ILivro>;
export type EntityArrayResponseType = HttpResponse<ILivro[]>;

@Injectable({ providedIn: 'root' })
export class LivroService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/livros');

  create(livro: NewLivro): Observable<EntityResponseType> {
    return this.http.post<ILivro>(this.resourceUrl, livro, { observe: 'response' });
  }

  update(livro: ILivro): Observable<EntityResponseType> {
    return this.http.put<ILivro>(`${this.resourceUrl}/${this.getLivroIdentifier(livro)}`, livro, { observe: 'response' });
  }

  partialUpdate(livro: PartialUpdateLivro): Observable<EntityResponseType> {
    return this.http.patch<ILivro>(`${this.resourceUrl}/${this.getLivroIdentifier(livro)}`, livro, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILivro>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILivro[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLivroIdentifier(livro: Pick<ILivro, 'id'>): number {
    return livro.id;
  }

  compareLivro(o1: Pick<ILivro, 'id'> | null, o2: Pick<ILivro, 'id'> | null): boolean {
    return o1 && o2 ? this.getLivroIdentifier(o1) === this.getLivroIdentifier(o2) : o1 === o2;
  }

  addLivroToCollectionIfMissing<Type extends Pick<ILivro, 'id'>>(
    livroCollection: Type[],
    ...livrosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const livros: Type[] = livrosToCheck.filter(isPresent);
    if (livros.length > 0) {
      const livroCollectionIdentifiers = livroCollection.map(livroItem => this.getLivroIdentifier(livroItem));
      const livrosToAdd = livros.filter(livroItem => {
        const livroIdentifier = this.getLivroIdentifier(livroItem);
        if (livroCollectionIdentifiers.includes(livroIdentifier)) {
          return false;
        }
        livroCollectionIdentifiers.push(livroIdentifier);
        return true;
      });
      return [...livrosToAdd, ...livroCollection];
    }
    return livroCollection;
  }
}
