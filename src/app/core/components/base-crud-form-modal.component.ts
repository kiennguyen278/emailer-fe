import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@core/services/notification.service';
import { FormUtil } from '@core/utils';
import { Store } from '@ngrx/store';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { BaseCrudFormComponent } from './base-crud-form.component';

@Component({
  template: ''
})
export abstract class BaseCrudFormModalComponent<T = any>
  extends BaseCrudFormComponent<T>
  implements OnInit
{
  constructor(
    fb: FormBuilder,
    store: Store<any>,
    router: Router,
    activatedRoute: ActivatedRoute,
    notificationService: NotificationService,
    protected modalRef: NzModalRef
  ) {
    super(fb, store, router, activatedRoute, notificationService);
  }

  close() {
    this.modalRef.destroy();
  }

  submit() {
    FormUtil.validate(this.form);
  }
}
