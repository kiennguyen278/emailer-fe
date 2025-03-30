import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NotificationService } from '@core/services/notification.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html'
})
export class NotificationComponent {
  @ViewChild('template', { read: TemplateRef }) template: TemplateRef<any>;
  type: string = 'info';
  title: string = 'Info';
  content: string = '';
  duration: number;
  messageId: string;
  constructor(
    private notify: NzNotificationService,
    private notificationService: NotificationService
  ) {
    this.notificationService.component = this;
  }

  show() {
    this.notify.remove(this.messageId);
    this.messageId = this.notify.template(this.template, {
      nzClass: this.type,
      nzDuration: this.duration
    }).messageId;
  }
}
