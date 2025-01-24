import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { LivroDetailComponent } from './livro-detail.component';

describe('Livro Management Detail Component', () => {
  let comp: LivroDetailComponent;
  let fixture: ComponentFixture<LivroDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LivroDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./livro-detail.component').then(m => m.LivroDetailComponent),
              resolve: { livro: () => of({ id: 16172 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(LivroDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LivroDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load livro on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', LivroDetailComponent);

      // THEN
      expect(instance.livro()).toEqual(expect.objectContaining({ id: 16172 }));
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
