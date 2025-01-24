import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { EstudanteService } from '../service/estudante.service';
import { IEstudante } from '../estudante.model';
import { EstudanteFormService } from './estudante-form.service';

import { EstudanteUpdateComponent } from './estudante-update.component';

describe('Estudante Management Update Component', () => {
  let comp: EstudanteUpdateComponent;
  let fixture: ComponentFixture<EstudanteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let estudanteFormService: EstudanteFormService;
  let estudanteService: EstudanteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EstudanteUpdateComponent],
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
      .overrideTemplate(EstudanteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EstudanteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    estudanteFormService = TestBed.inject(EstudanteFormService);
    estudanteService = TestBed.inject(EstudanteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const estudante: IEstudante = { id: 1629 };

      activatedRoute.data = of({ estudante });
      comp.ngOnInit();

      expect(comp.estudante).toEqual(estudante);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEstudante>>();
      const estudante = { id: 19416 };
      jest.spyOn(estudanteFormService, 'getEstudante').mockReturnValue(estudante);
      jest.spyOn(estudanteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ estudante });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: estudante }));
      saveSubject.complete();

      // THEN
      expect(estudanteFormService.getEstudante).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(estudanteService.update).toHaveBeenCalledWith(expect.objectContaining(estudante));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEstudante>>();
      const estudante = { id: 19416 };
      jest.spyOn(estudanteFormService, 'getEstudante').mockReturnValue({ id: null });
      jest.spyOn(estudanteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ estudante: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: estudante }));
      saveSubject.complete();

      // THEN
      expect(estudanteFormService.getEstudante).toHaveBeenCalled();
      expect(estudanteService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEstudante>>();
      const estudante = { id: 19416 };
      jest.spyOn(estudanteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ estudante });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(estudanteService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
