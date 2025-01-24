import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { AutorService } from '../service/autor.service';
import { IAutor } from '../autor.model';
import { AutorFormService } from './autor-form.service';

import { AutorUpdateComponent } from './autor-update.component';

describe('Autor Management Update Component', () => {
  let comp: AutorUpdateComponent;
  let fixture: ComponentFixture<AutorUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let autorFormService: AutorFormService;
  let autorService: AutorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AutorUpdateComponent],
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
      .overrideTemplate(AutorUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AutorUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    autorFormService = TestBed.inject(AutorFormService);
    autorService = TestBed.inject(AutorService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const autor: IAutor = { id: 27814 };

      activatedRoute.data = of({ autor });
      comp.ngOnInit();

      expect(comp.autor).toEqual(autor);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAutor>>();
      const autor = { id: 29313 };
      jest.spyOn(autorFormService, 'getAutor').mockReturnValue(autor);
      jest.spyOn(autorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ autor });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: autor }));
      saveSubject.complete();

      // THEN
      expect(autorFormService.getAutor).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(autorService.update).toHaveBeenCalledWith(expect.objectContaining(autor));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAutor>>();
      const autor = { id: 29313 };
      jest.spyOn(autorFormService, 'getAutor').mockReturnValue({ id: null });
      jest.spyOn(autorService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ autor: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: autor }));
      saveSubject.complete();

      // THEN
      expect(autorFormService.getAutor).toHaveBeenCalled();
      expect(autorService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAutor>>();
      const autor = { id: 29313 };
      jest.spyOn(autorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ autor });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(autorService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
