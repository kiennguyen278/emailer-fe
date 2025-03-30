import { Injectable } from '@angular/core';
import { OptionModel } from "@core/models/option.model";
import { NotificationComponent } from "@shared/components/notification/notification.component";
export interface NotificationModel {
  type: 'success' | 'info' | 'warning' | 'error';
  title?: string;
  content: string;
  duration?: number;
}

const titles: OptionModel<string>[] = [
  { value: 'success', label: 'Thành công' },
  { value: 'info', label: 'Thông tin' },
  { value: 'warning', label: 'Cảnh báo' },
  { value: 'error', label: 'Lỗi' },
  { value: 'custom', label: 'Custom' }
];

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  component: NotificationComponent;

  open(config: NotificationModel) {
    const title =
      config.title || titles.find((x) => x.value === config.type)?.label!;
    this.component.type = config.type;
    this.component.title = title;
    this.component.content = config.content;
    this.component.duration = config.duration || 3000;
    this.component.show();
  }
}
