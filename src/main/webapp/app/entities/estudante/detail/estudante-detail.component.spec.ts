import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { EstudanteDetailComponent } from './estudante-detail.component';

describe('Estudante Management Detail Component', () => {
  let comp: EstudanteDetailComponent;
  let fixture: ComponentFixture<EstudanteDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstudanteDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./estudante-detail.component').then(m => m.EstudanteDetailComponent),
              resolve: { estudante: () => of({ id: 19416 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(EstudanteDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstudanteDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load estudante on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', EstudanteDetailComponent);

      // THEN
      expect(instance.estudante()).toEqual(expect.objectContaining({ id: 19416 }));
    });
  });

  describe('PreviousState', () => {
    it('Should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
