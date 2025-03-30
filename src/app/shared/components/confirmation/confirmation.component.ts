import { Observable } from 'rxjs/internal/Observable';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[confirmation], app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfirmationComponent {
  @ViewChild('template', { read: TemplateRef }) template: TemplateRef<void>;
  @Input() confirmation: string | TemplateRef<HTMLDivElement> | undefined;
  @Input() labelButton: string = 'Đồng ý';
  @Input() labelButtonCancel: string = 'Bỏ qua';
  @Input() title: string;
  @Input() width: number;
  @Input() showCloseBtn = false;
  @Input() selectLoading: Observable<boolean>;
  data: any;
  @Output() dismiss = new EventEmitter();
  @Output() confirmed = new EventEmitter();
  modalRef: NzModalRef;
  constructor(
    private modalService: NzModalService,
  ) { }

  @HostListener('click')
  show(data?: any) {
    if (!this.confirmation) {
      this.confirmed.emit();
      return;
    }
    this.data = data;
    this.modalRef = this.modalService.create({
      nzTitle: this.title || undefined,
      nzClosable: false,
      nzContent: this.template,
      nzFooter: null,
      nzWidth: this.width || 380,
      nzClassName: 'modal-confirm'
    });
  }

  hide() {
    this.dismiss.emit();
    this.modalRef.destroy();
  }

  confirm() {
    this.confirmed.emit(this.data);
    this.modalRef.destroy();
  }

}
