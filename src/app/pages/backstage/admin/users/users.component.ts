import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../data/admin.service';
import { UserDTO } from '../data/admin.dto';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
  isEditMode = false;
  users: UserDTO[] = [];
  columns: any[] = [];
  userForm!: FormGroup;
  isModalVisible = false;
  modalTitle = 'Thêm/Cập nhật User';
  isSaving = false;

  selectedUser: UserDTO | null = null;

  // Filter và phân trang
  filter = {
    email: '',
    status: ''
  };
  pageIndex = 1;
  pageSize = 10;
  totalItems = 0;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.initColumns();
    this.loadUsers();
    this.initForm();
  }

  initForm(): void {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      active: [true, Validators.required],
      businessInfo: this.fb.group({
        businessName: [''],
        businessEmail: [''],
        businessDomain: [''],
        isVerified: [false],
        useCustomSmtp: [false]
      })
    });
  }

  initColumns(): void {
    this.columns = [
      { title: 'ID', key: 'id' },
      { title: 'Email', key: 'email' },
      { title: 'Role', key: 'role' },
      {
        title: 'Trạng thái',
        key: 'status'
      },
      { title: 'Ngày tạo', key: 'createdAt' },
      { title: 'Actions', key: 'actions', type: 'template' }
    ];
  }

  onSearch(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminService
      .getUsers(this.filter.email, this.filter.status, this.pageIndex, this.pageSize)
      .subscribe((res: any) => {
        this.users = res.items;
        this.totalItems = res.total;
      });
  }

  onFilterChange(): void {
    this.pageIndex = 1;
    this.loadUsers();
  }

  onPageChange(page: number): void {
    this.pageIndex = page;
    this.loadUsers();
  }

  showCreateModal(): void {
    this.isEditMode = false;
    this.selectedUser = null;
    this.modalTitle = 'Thêm User';
    this.isModalVisible = true;
    this.userForm.reset({
      email: '',
      active: true,
      businessInfo: {
        businessName: '',
        businessEmail: '',
        businessDomain: '',
        isVerified: false,
        useCustomSmtp: false
      }
    });
    this.userForm.get('email')?.enable();
  }

  showEditModal(user: UserDTO): void {
    this.isEditMode = true;
    this.selectedUser = user;
    this.modalTitle = 'Sửa User';
    this.isModalVisible = true;
    this.userForm.patchValue({
      email: user.email,
      active: user.status,
      businessInfo: {
        businessName: user.businessName,
        businessEmail: user.businessEmail,
        businessDomain: user.businessDomain,
        isVerified: user.isVerified,
        useCustomSmtp: user.useCustomSmtp
      }
    });

    this.userForm.get('email')?.disable();
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.userForm.reset();
  }

  submitUserForm(): void {
    if (this.userForm.invalid) return;
    const formValue = this.userForm.value;
    this.isSaving = true;

    if (this.selectedUser) {
      this.adminService.updateBusinessProfile(this.selectedUser.userId!, formValue).subscribe(
        () => {
          this.message.success('Cập nhật user thành công');
          this.loadUsers();
          this.isModalVisible = false;
          this.isSaving = false;
        },
        () => (this.isSaving = false)
      );
    } else {
      this.adminService.createUser(formValue).subscribe(
        () => {
          this.message.success('Thêm user thành công');
          this.loadUsers();
          this.isModalVisible = false;
          this.isSaving = false;
        },
        () => (this.isSaving = false)
      );
    }
  }

  onToggleActiveStatus(isActive: boolean): void {
    this.userForm.get('active')?.setValue(isActive);
    if (this.selectedUser?.userId) {
      this.adminService.updateUserStatus(this.selectedUser.userId,isActive).subscribe(() => {
        this.message.success(`Đã ${isActive ? 'kích hoạt' : 'vô hiệu hoá'} user`);
        this.loadUsers();
      });
    }
  }
}
