import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IAutor } from '../autor.model';
import { AutorService } from '../service/autor.service';

@Component({
  templateUrl: './autor-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AutorDeleteDialogComponent {
  autor?: IAutor;

  protected autorService = inject(AutorService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.autorService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
