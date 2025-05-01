import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzModalService} from 'ng-zorro-antd/modal';
import {AdminService} from '../data/admin.service';
import {UserDTO} from '../data/admin.dto';
import {ColumnConfig} from "@core/models";
import {UserDetailModalComponent} from "./components/user-detail-modal/user-detail-modal.component";
import {NotificationService} from "@core/services/notification.service";
import {SwitchStatusUserRequest} from "../models";
import {ValidatorUtil} from "@core/utils/validator.util";
import {FormUtil} from "@core/utils/form.util";
import {DATE_TIME_FORMAT} from '@core/constants';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  modalRef: any; // Dùng để đóng modal từ bên trong
  @ViewChild('modalUserForm', { static: true }) modalUserFormTpl!: TemplateRef<any>;
  formSearch: FormGroup;
  formUser: FormGroup;

  allItems: UserDTO[] = [];
  filteredItems: UserDTO[] = [];
  pagedItems: UserDTO[] = [];

  pagination = { pageIndex: 1, pageSize: 20, total: 0 };
  loading = false;

  DATE_TIME_FORMAT = DATE_TIME_FORMAT;

  statusOptions = [
    { label: 'ACTIVE', value: 'ACTIVE' },
    { label: 'INACTIVE', value: 'INACTIVE' },
    { label: 'LOCKED', value: 'LOCKED' }
  ];

  columns: ColumnConfig[] = [
    {
      header: 'Email',
      key: 'email',
      tdClass: 'text-center',
      nzWidth: '100px'
    },
    {
      header: 'Role',
      key: 'role',
      tdClass: 'text-center',
      nzWidth: '100px'
    },
    {
      header: 'Trạng thái',
      key: 'status',
      tdClass: 'text-center',
      nzWidth: '100px',
      pipe: 'template',
    },

    {
      header: 'Biz Name',
      key: 'businessName',
      tdClass: 'text-center',
      nzWidth: '100px'
    },

    {
      header: 'Biz Email',
      key: 'businessEmail',
      tdClass: 'text-center',
      nzWidth: '100px'
    },

    {
      header: 'Biz Status',
      key: 'statusBusinessEmail',
      tdClass: 'text-center',
      nzWidth: '100px'
    },

    {
      header: 'Custom Smtp',
      key: 'useCustomSmtp',
      tdClass: 'text-center',
      nzWidth: '50px'
    },

    {
      header: 'Register Date',
      key: 'createdAt',
      tdClass: 'text-center',
      nzWidth: '100px',
      pipe: 'template',
    },

    {
      header: 'Thao tác',
      key: 'actions',
      tdClass: 'text-center',
      nzWidth: '200px',
      pipe: 'template',
    }
  ];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private modal: NzModalService,
    private notification: NotificationService,
  ) {}

  ngOnInit(): void {
    this.formSearch = this.fb.group({
      status: [null],
      email: ['']
    });

    this.formUser = this.fb.group({
      email: ['', [ValidatorUtil.required('Email không được để trống'), ValidatorUtil.email('Email không đúng định dạng')]],
      status: ['INACTIVE']
    });

    this.loadAllUsers();
  }

  loadAllUsers(): void {
    this.loading = true;
    this.adminService.getAllUsers().subscribe(res => {
      if (res.success) {
        this.allItems = res.data.map(item => {
          return {
            ...item,
            activeStatus: item.status === 'ACTIVE'
          }
        });
        this.applySearchAndPagination();
        this.loading = false;
      }
    });
  }

  applySearchAndPagination(): void {
    const { status, email } = this.formSearch.value;

    this.filteredItems = this.allItems.filter(user => {
      const matchStatus = status ? user.status === status : true;
      // @ts-ignore
      const matchEmail = email ? user.email.toLowerCase().includes(email.toLowerCase()) : true;
      return matchStatus && matchEmail;
    });

    this.pagination.total = this.filteredItems.length;
    this.setPagedItems();
  }

  setPagedItems(): void {
    const { pageIndex, pageSize } = this.pagination;
    const start = (pageIndex - 1) * pageSize;
    const end = start + pageSize;
    this.pagedItems = this.filteredItems.slice(start, end);
  }

  onSearch(): void {
    this.pagination.pageIndex = 1;
    this.applySearchAndPagination();
  }

  onQueryParams(params: any): void {
    this.pagination.pageIndex = params.pageIndex;
    this.pagination.pageSize = params.pageSize;
    this.setPagedItems();
  }

  showCreateModal(): void {
    this.formUser.reset({ status: 'INACTIVE' });
    this.modalRef = this.modal.create({
      nzTitle: 'Thêm User mới',
      nzContent: this.modalUserFormTpl,
      nzFooter: null,
      nzClosable: false,
      nzMaskClosable: false
    });
  }

  closeModal(): void {
    this.modal.closeAll();
  }

  saveUser(): void {
    FormUtil.validate(this.formUser);

    const value = this.formUser.value;

    this.adminService.createUser(value).subscribe({
      next: (res) => {
        this.notification.open({
          type: 'success',
          content: res?.message || 'Tạo người dùng thành công!'
        });
        this.closeModal();
        this.loadAllUsers()
      },
      error: ({error}) => {
        console.log('error', error)
        this.notification.open({
          type: 'error',
          content: error?.message || 'Tạo người dùng thất bại. Vui lòng thử lại sau!'
        });
      }
    });
  }

  showViewModal(user: UserDTO): void {
    const modalDetail = this.modal.create({
      nzTitle: 'Chi tiết người dùng',
      nzContent: UserDetailModalComponent,
      nzData: {
        user: user || null
      },
      nzWidth: 800,
      nzFooter: null,
      nzMaskClosable: false
    });

    modalDetail.afterClose.subscribe(isReload => {
      if(isReload){
        this.loadAllUsers();
      }
    });
  }

  onSwitchStatus(item: UserDTO){
    const request: SwitchStatusUserRequest = {
      userId: item.id!,
      status: !item.activeStatus,
    }
    this.adminService.updateUserStatus(request)
      .pipe()
      .subscribe({
        next: (res: any) => {
          this.loadAllUsers();
          this.notification.open({
            type: 'success',
            content: res?.message || 'Trạng thái user đã được cập nhật'
          });
        },
        error: ({error}) => {
          this.notification.open({
            type: 'error',
            content: error?.message || 'Có lỗi khi thay đổi trạng thái user'
          });
        }
      })
  }

  confirmSwitchStatus(item: UserDTO){
    this.modal.confirm({
      nzTitle: `Bạn có muốn thay đổi trạng thái của user email "${item.email}"?`,
      nzOkText: 'OK',
      nzOnOk: () => this.onSwitchStatus(item)
    });
  }

  closeUserModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }
}
