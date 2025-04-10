import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AdminService } from '../data/admin.service';
import { UserDTO } from '../data/admin.dto';
import { BehaviorSubject } from 'rxjs';

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

  selectedUser: UserDTO | null = null;

  pagination = { pageIndex: 1, pageSize: 20, total: 0 };
  loading$ = new BehaviorSubject<boolean>(false);
  isSaving = false;
  isEditing = false;



  statusOptions = [
    { label: 'ACTIVE', value: 'ACTIVE' },
    { label: 'INACTIVE', value: 'INACTIVE' }
  ];

  columns = [
    {
      title: 'Email',
      header: 'Email',
      key: 'email',
      tdClass: 'text-center',
      nzWidth: '200px'
    },
    {
      title: 'Trạng thái',
      header: 'Trạng thái',
      key: 'status',
      tdClass: 'text-center',
      nzWidth: '200px'
    },
    {
      title: 'Thao tác',
      header: 'Actions',
      key: 'actions',
      tdClass: 'text-center',
      nzWidth: '200px',
      type: 'action' // ⬅️ bắt buộc phải có dòng này
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
      email: ['', [Validators.required, Validators.email]],
      status: ['ACTIVE', Validators.required]
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
    this.isEditing = false;
    this.formUser.reset({ status: 'ACTIVE' });
    this.modal.create({
      nzTitle: 'Thêm User mới',
      nzContent: this.modalUserFormTpl, // ✅ dùng TemplateRef
      nzFooter: null,
      nzClosable: false,
      nzMaskClosable: false
    });
  }

  showEditModal(user: UserDTO): void {
    this.isEditing = true;
    this.formUser.patchValue(user);
    this.modal.create({
      nzTitle: 'Chỉnh sửa User',
      nzContent: this.modalUserFormTpl, // ✅ dùng TemplateRef
      nzFooter: null,
      nzClosable: false,
      nzMaskClosable: false
    });
  }

  showViewModal(user: UserDTO): void {
    this.selectedUser = user;
    this.modal.create({
      nzTitle: 'Chi tiết User',
      nzContent: 'modalViewUser',
      nzFooter: null
    });
  }

  closeModal(): void {
    this.modal.closeAll();
  }

  saveUser(): void {
    if (this.formUser.invalid) return;
    const value = this.formUser.value;
    this.isSaving = true;

    const request$ = this.isEditing
      ? this.adminService.updateBusinessProfile(value.id, value)
      : this.adminService.createUser(value);

    request$.subscribe(() => {
      this.isSaving = false;
      this.closeModal();
      this.loadAllUsers();
    });
  }

  confirmDelete(user: UserDTO): void {
    alert("Dont delete user!");
  }
}
