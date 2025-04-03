import {ChangeDetectorRef, Component, inject, OnInit, ViewChild} from '@angular/core';
import {QuillEditorComponent} from "ngx-quill";
import {ColumnConfig} from "@core/models";
import {DATE_TIME_FORMAT} from "@core/constants";
import {NZ_MODAL_DATA, NzModalRef} from "ng-zorro-antd/modal";
import {CampaignDetailDTO, EmailCampaignDTO} from "../../../models";
import {EmailService} from "../../../state/service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {SubscriberDTO} from "../../../../subscribers/models";

@UntilDestroy()
@Component({
  selector: 'app-campaign-detail',
  templateUrl: './campaign-detail.component.html',
})
export class CampaignDetailComponent implements OnInit {
  @ViewChild('quillEditor') quillEditorComponent!: QuillEditorComponent;

  readonly modalData: {emailCampaign: EmailCampaignDTO} = inject(NZ_MODAL_DATA);
  get emailCampaign(): EmailCampaignDTO {
    return this.modalData.emailCampaign;
  }

  constructor(
    private modalRef: NzModalRef,
    private cdr: ChangeDetectorRef,
    private emailService: EmailService,
  ) {
  }

  itemsSubscriber: SubscriberDTO[] = [];
  columnsSubscriber: ColumnConfig[] = [
    {
      key: 'email',
      header: 'Email',
      tdClass: 'text-center',
      nzWidth: '200px',
    },
    {
      key: 'firstName',
      header: 'Name',
      tdClass: 'text-center',
      nzWidth: '150px',
    },
    {
      key: 'status',
      header: 'Trạng thái',
      nzWidth: '100px',
      tdClass: 'text-center',
    },
  ];

  detailCampaign: CampaignDetailDTO;

  DATE_TIME_FORMAT = DATE_TIME_FORMAT;


  ngOnInit(): void {
    this.getDetailCampaign();
  }


  getDetailCampaign() {
    if (this.emailCampaign){
      this.emailService.getDetailCampaignsById(this.emailCampaign.id)
        .pipe(untilDestroyed(this))
        .subscribe(({data}) => {
          console.log('item', data)
          this.detailCampaign = data;
          this.itemsSubscriber = data.subscribers;
        })
    }
  }



  closeModal(){
    this.modalRef.destroy();
  }



}
