import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IAutor } from 'app/entities/autor/autor.model';
import { AutorService } from 'app/entities/autor/service/autor.service';
import { LivroService } from '../service/livro.service';
import { ILivro } from '../livro.model';
import { LivroFormService } from './livro-form.service';

import { LivroUpdateComponent } from './livro-update.component';

describe('Livro Management Update Component', () => {
  let comp: LivroUpdateComponent;
  let fixture: ComponentFixture<LivroUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let livroFormService: LivroFormService;
  let livroService: LivroService;
  let autorService: AutorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LivroUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(LivroUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LivroUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    livroFormService = TestBed.inject(LivroFormService);
    livroService = TestBed.inject(LivroService);
    autorService = TestBed.inject(AutorService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Autor query and add missing value', () => {
      const livro: ILivro = { id: 26070 };
      const autor: IAutor = { id: 29313 };
      livro.autor = autor;

      const autorCollection: IAutor[] = [{ id: 29313 }];
      jest.spyOn(autorService, 'query').mockReturnValue(of(new HttpResponse({ body: autorCollection })));
      const additionalAutors = [autor];
      const expectedCollection: IAutor[] = [...additionalAutors, ...autorCollection];
      jest.spyOn(autorService, 'addAutorToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ livro });
      comp.ngOnInit();

      expect(autorService.query).toHaveBeenCalled();
      expect(autorService.addAutorToCollectionIfMissing).toHaveBeenCalledWith(
        autorCollection,
        ...additionalAutors.map(expect.objectContaining),
      );
      expect(comp.autorsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const livro: ILivro = { id: 26070 };
      const autor: IAutor = { id: 29313 };
      livro.autor = autor;

      activatedRoute.data = of({ livro });
      comp.ngOnInit();

      expect(comp.autorsSharedCollection).toContainEqual(autor);
      expect(comp.livro).toEqual(livro);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILivro>>();
      const livro = { id: 16172 };
      jest.spyOn(livroFormService, 'getLivro').mockReturnValue(livro);
      jest.spyOn(livroService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ livro });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: livro }));
      saveSubject.complete();

      // THEN
      expect(livroFormService.getLivro).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(livroService.update).toHaveBeenCalledWith(expect.objectContaining(livro));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILivro>>();
      const livro = { id: 16172 };
      jest.spyOn(livroFormService, 'getLivro').mockReturnValue({ id: null });
      jest.spyOn(livroService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ livro: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: livro }));
      saveSubject.complete();

      // THEN
      expect(livroFormService.getLivro).toHaveBeenCalled();
      expect(livroService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILivro>>();
      const livro = { id: 16172 };
      jest.spyOn(livroService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ livro });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(livroService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAutor', () => {
      it('Should forward to autorService', () => {
        const entity = { id: 29313 };
        const entity2 = { id: 27814 };
        jest.spyOn(autorService, 'compareAutor');
        comp.compareAutor(entity, entity2);
        expect(autorService.compareAutor).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
