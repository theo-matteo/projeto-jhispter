import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IEstudante } from 'app/entities/estudante/estudante.model';
import { EstudanteService } from 'app/entities/estudante/service/estudante.service';
import { ILivro } from 'app/entities/livro/livro.model';
import { LivroService } from 'app/entities/livro/service/livro.service';
import { IEmprestimo } from '../emprestimo.model';
import { EmprestimoService } from '../service/emprestimo.service';
import { EmprestimoFormService } from './emprestimo-form.service';

import { EmprestimoUpdateComponent } from './emprestimo-update.component';

describe('Emprestimo Management Update Component', () => {
  let comp: EmprestimoUpdateComponent;
  let fixture: ComponentFixture<EmprestimoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let emprestimoFormService: EmprestimoFormService;
  let emprestimoService: EmprestimoService;
  let estudanteService: EstudanteService;
  let livroService: LivroService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EmprestimoUpdateComponent],
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
      .overrideTemplate(EmprestimoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EmprestimoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    emprestimoFormService = TestBed.inject(EmprestimoFormService);
    emprestimoService = TestBed.inject(EmprestimoService);
    estudanteService = TestBed.inject(EstudanteService);
    livroService = TestBed.inject(LivroService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Estudante query and add missing value', () => {
      const emprestimo: IEmprestimo = { id: 1225 };
      const estudante: IEstudante = { id: 19416 };
      emprestimo.estudante = estudante;

      const estudanteCollection: IEstudante[] = [{ id: 19416 }];
      jest.spyOn(estudanteService, 'query').mockReturnValue(of(new HttpResponse({ body: estudanteCollection })));
      const additionalEstudantes = [estudante];
      const expectedCollection: IEstudante[] = [...additionalEstudantes, ...estudanteCollection];
      jest.spyOn(estudanteService, 'addEstudanteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ emprestimo });
      comp.ngOnInit();

      expect(estudanteService.query).toHaveBeenCalled();
      expect(estudanteService.addEstudanteToCollectionIfMissing).toHaveBeenCalledWith(
        estudanteCollection,
        ...additionalEstudantes.map(expect.objectContaining),
      );
      expect(comp.estudantesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Livro query and add missing value', () => {
      const emprestimo: IEmprestimo = { id: 1225 };
      const livro: ILivro = { id: 16172 };
      emprestimo.livro = livro;

      const livroCollection: ILivro[] = [{ id: 16172 }];
      jest.spyOn(livroService, 'query').mockReturnValue(of(new HttpResponse({ body: livroCollection })));
      const additionalLivros = [livro];
      const expectedCollection: ILivro[] = [...additionalLivros, ...livroCollection];
      jest.spyOn(livroService, 'addLivroToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ emprestimo });
      comp.ngOnInit();

      expect(livroService.query).toHaveBeenCalled();
      expect(livroService.addLivroToCollectionIfMissing).toHaveBeenCalledWith(
        livroCollection,
        ...additionalLivros.map(expect.objectContaining),
      );
      expect(comp.livrosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const emprestimo: IEmprestimo = { id: 1225 };
      const estudante: IEstudante = { id: 19416 };
      emprestimo.estudante = estudante;
      const livro: ILivro = { id: 16172 };
      emprestimo.livro = livro;

      activatedRoute.data = of({ emprestimo });
      comp.ngOnInit();

      expect(comp.estudantesSharedCollection).toContainEqual(estudante);
      expect(comp.livrosSharedCollection).toContainEqual(livro);
      expect(comp.emprestimo).toEqual(emprestimo);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmprestimo>>();
      const emprestimo = { id: 30317 };
      jest.spyOn(emprestimoFormService, 'getEmprestimo').mockReturnValue(emprestimo);
      jest.spyOn(emprestimoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ emprestimo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: emprestimo }));
      saveSubject.complete();

      // THEN
      expect(emprestimoFormService.getEmprestimo).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(emprestimoService.update).toHaveBeenCalledWith(expect.objectContaining(emprestimo));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmprestimo>>();
      const emprestimo = { id: 30317 };
      jest.spyOn(emprestimoFormService, 'getEmprestimo').mockReturnValue({ id: null });
      jest.spyOn(emprestimoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ emprestimo: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: emprestimo }));
      saveSubject.complete();

      // THEN
      expect(emprestimoFormService.getEmprestimo).toHaveBeenCalled();
      expect(emprestimoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmprestimo>>();
      const emprestimo = { id: 30317 };
      jest.spyOn(emprestimoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ emprestimo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(emprestimoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareEstudante', () => {
      it('Should forward to estudanteService', () => {
        const entity = { id: 19416 };
        const entity2 = { id: 1629 };
        jest.spyOn(estudanteService, 'compareEstudante');
        comp.compareEstudante(entity, entity2);
        expect(estudanteService.compareEstudante).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareLivro', () => {
      it('Should forward to livroService', () => {
        const entity = { id: 16172 };
        const entity2 = { id: 26070 };
        jest.spyOn(livroService, 'compareLivro');
        comp.compareLivro(entity, entity2);
        expect(livroService.compareLivro).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
