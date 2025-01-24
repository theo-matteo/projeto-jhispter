import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IEstudante } from '../estudante.model';

@Component({
  selector: 'jhi-estudante-detail',
  templateUrl: './estudante-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class EstudanteDetailComponent {
  estudante = input<IEstudante | null>(null);

  previousState(): void {
    window.history.back();
  }
}
