import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IEmprestimo } from '../emprestimo.model';
import { EmprestimoService } from '../service/emprestimo.service';

@Component({
  templateUrl: './emprestimo-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class EmprestimoDeleteDialogComponent {
  emprestimo?: IEmprestimo;

  protected emprestimoService = inject(EmprestimoService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.emprestimoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
