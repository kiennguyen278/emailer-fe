import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AdminService } from '../data/admin.service';
import { UserDTO } from '../data/admin.dto';
import { BehaviorSubject } from 'rxjs';
import {ColumnConfig} from "@core/models";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  @ViewChild('modalUserForm', { static: true }) modalUserFormTpl!: TemplateRef<any>;
  formSearch: FormGroup;
  formUser: FormGroup;

  allItems: UserDTO[] = [];
  filteredItems: UserDTO[] = [];
  pagedItems: UserDTO[] = [];

  pagination = { pageIndex: 1, pageSize: 20, total: 0 };
  loading$ = new BehaviorSubject<boolean>(false);
  isSaving = false;

  selectedUser: UserDTO | null = null;
  isViewModalVisible = false;
  activeTabIndex = 0;

  statusOptions = [
    { label: 'ACTIVE', value: 'ACTIVE' },
    { label: 'INACTIVE', value: 'INACTIVE' }
  ];

  columns: ColumnConfig[] = [
    {
      header: 'Email',
      key: 'email',
      tdClass: 'text-center',
      nzWidth: '200px'
    },
    {
      header: 'Trạng thái',
      key: 'status',
      tdClass: 'text-center',
      nzWidth: '200px'
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
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.formSearch = this.fb.group({
      status: [null],
      email: ['']
    });

    this.formUser = this.fb.group({
      id: [null],
      email: ['', [Validators.required, Validators.email]]
    });

    this.loadAllUsers();
  }

  loadAllUsers(): void {
    this.loading$.next(true);
    this.adminService.getAllUsers().subscribe(res => {
      if (res.success) {
        this.allItems = res.data;
        this.applySearchAndPagination();
        this.loading$.next(false);
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
    this.modal.create({
      nzTitle: 'Thêm User mới',
      nzContent: this.modalUserFormTpl, // ✅ dùng TemplateRef
      nzFooter: null,
      nzClosable: false,
      nzMaskClosable: false
    });
  }

  closeModal(): void {
    this.modal.closeAll();
  }

  saveUser(): void {
    if (this.formUser.invalid) {
      alert("Hãy nhập email đúng định dạng");
      return;
    }
    const value = this.formUser.value;

    this.adminService.createUser(value).subscribe({
      next: () => {
        alert("✅ Tạo người dùng thành công!");
        this.closeModal();
        this.loadAllUsers()
      },
      error: (err) => {
        alert("❌ Tạo người dùng thất bại. Vui lòng thử lại sau!");
        console.error("Create user failed:", err);
      }
    });
  }

  showViewModal(user: UserDTO): void {
    console.log('Selected user:', user);
    this.selectedUser = { ...user };
    this.activeTabIndex = 0;
    this.isViewModalVisible = true;
  }

  closeViewModal(): void {
    this.isViewModalVisible = false;
    this.selectedUser = null;
  }

  toggleUserStatus(): void {
    if (!this.selectedUser || this.selectedUser.id == null) return;
    const newStatus = this.selectedUser.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const dto = { id: this.selectedUser.id, status: newStatus };
    this.adminService.updateUserStatus(this.selectedUser.id,dto).subscribe(() => {
      this.selectedUser!.status = newStatus;
    });
  }

  updateBusinessInfo(): void {
    if (!this.selectedUser || this.selectedUser.id == null) return;
    const userDto = {
      businessName: this.selectedUser.businessName,
      businessEmail: this.selectedUser.businessEmail,
      businessDomain: this.selectedUser.domain
    };
    this.adminService.updateBusinessProfile(this.selectedUser.id, userDto).subscribe({
      next: () => {
        alert('✅ Đã cập nhật thông tin business!');
      },
      error: (err) => {
        console.error('❌ Lỗi khi cập nhật business info:', err);
        alert('❌ Cập nhật thất bại!');
      }
    });
  }

  updateBusinessStatus(): void {
    if (!this.selectedUser || this.selectedUser.id == null) return;
    const dto = {
      id: this.selectedUser.id,
      statusBusinessEmail: this.selectedUser.statusBusinessEmail
    };
    this.adminService.updateBusinessStatus(this.selectedUser.id,dto).subscribe();
  }
}
