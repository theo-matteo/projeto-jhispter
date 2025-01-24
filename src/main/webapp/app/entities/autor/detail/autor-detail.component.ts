import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IAutor } from '../autor.model';

@Component({
  selector: 'jhi-autor-detail',
  templateUrl: './autor-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class AutorDetailComponent {
  autor = input<IAutor | null>(null);

  previousState(): void {
    window.history.back();
  }
}
