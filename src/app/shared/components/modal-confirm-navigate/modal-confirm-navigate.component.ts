import { Component } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-modal-confirm-navigate',
  // templateUrl: './modal-confirm-navigate.component.html',
  template: `
    <div>
      <p>Are you sure you want to leave this page?</p>
    </div>
    <div class="modal-footer">
      <button nz-button (click)="handleOk()">OK</button>
      <button nz-button (click)="handleCancel()">Cancel</button>
    </div>
  `,
  styleUrls: ['./modal-confirm-navigate.component.scss']
})
export class ModalConfirmNavigateComponent {

  constructor(private modal: NzModalRef) {}

  handleOk(): void {
    this.modal.destroy(true);
  }

  handleCancel(): void {
    this.modal.destroy(false);
  }

}
