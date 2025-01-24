import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ILivro } from '../livro.model';
import { LivroService } from '../service/livro.service';

@Component({
  templateUrl: './livro-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class LivroDeleteDialogComponent {
  livro?: ILivro;

  protected livroService = inject(LivroService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.livroService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
