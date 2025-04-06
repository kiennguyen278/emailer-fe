import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {TagDTO} from "../../../subscribers/models";
import {FormBuilder, FormGroup} from "@angular/forms";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {Observable} from "rxjs";
import {Store} from "@ngrx/store";
import {NotificationService} from "@core/services/notification.service";
import {ColumnConfig} from "@core/models";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {ValidatorUtil} from "@core/utils/validator.util";
import {EmailTemplateDTO} from "../../models";
import {
  selectDataGetEmailTemplateList,
  selectErrorGetEmailTemplateList,
  selectLoadingGetEmailTemplateList
} from "../../state/selectors";
import {getListEmailTemplate} from "../../state/actions";
import {DATE_TIME_FORMAT} from "@core/constants";

@UntilDestroy()
@Component({
  selector: 'app-select-template-modal',
  templateUrl: './select-template-modal.component.html',
})
export class SelectTemplateModalComponent implements OnInit, OnDestroy {

  items: EmailTemplateDTO[] = [];
  selectedTemplates: EmailTemplateDTO[] = [];


  isLoading$: Observable<boolean> = this.store.select(selectLoadingGetEmailTemplateList);

  constructor(
    private store: Store,
    private cdr: ChangeDetectorRef,
    private modalRef: NzModalRef,
    private notification: NotificationService,
  ) {}

  DATE_TIME_FORMAT = DATE_TIME_FORMAT;

  columns: ColumnConfig[] = [
    {
      key: 'name',
      header: 'Tên Email Template',
      nzWidth: '200px',
    },
    {
      key: 'subject',
      header: 'Subject',
      nzWidth: '200px',
    },
    {
      key: 'createdAt',
      header: 'Ngày tạo',
      nzWidth: '100px',
      tdClass: 'text-center',
      pipe: 'template',
    },
    {
      key: 'status',
      header: 'Trạng thái',
      nzWidth: '100px',
      tdClass: 'text-center',
    },
  ];

  ngOnInit(): void {
    this.loadItems();

    this.store.select(selectDataGetEmailTemplateList)
      .pipe(untilDestroyed(this))
      .subscribe((items) => {
        this.items = items;
        this.cdr.detectChanges();
      });

    this.store.select(selectErrorGetEmailTemplateList)
      .pipe(untilDestroyed(this))
      .subscribe((error) => {
        if (error){
          this.notification.open({
            type: 'error',
            content: error || 'Không thể tải danh sách email template'
          });
        }
      });
  }

  loadItems(): void {
    this.store.dispatch(getListEmailTemplate());
  }

  onSelectedItem(items: EmailTemplateDTO[]) {
    console.log(items);
    this.selectedTemplates = items;
  }

  selectTemplate(){
    this.modalRef.destroy(this.selectedTemplates)
  }

  ngOnDestroy() {
    if (this.modalRef){
      this.modalRef.destroy();
    }
  }

}
