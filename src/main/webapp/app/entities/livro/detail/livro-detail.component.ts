import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { ILivro } from '../livro.model';

@Component({
  selector: 'jhi-livro-detail',
  templateUrl: './livro-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class LivroDetailComponent {
  livro = input<ILivro | null>(null);

  previousState(): void {
    window.history.back();
  }
}
