import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IEstudante } from '../estudante.model';
import { EstudanteService } from '../service/estudante.service';

@Component({
  templateUrl: './estudante-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class EstudanteDeleteDialogComponent {
  estudante?: IEstudante;

  protected estudanteService = inject(EstudanteService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.estudanteService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
