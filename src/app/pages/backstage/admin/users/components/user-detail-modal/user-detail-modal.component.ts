import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {NZ_MODAL_DATA, NzModalRef} from 'ng-zorro-antd/modal';
import {UserDTO} from "../../../data/admin.dto";
import {AdminService} from "../../../data/admin.service";
import {SequenceDTO} from "../../../../email/models";

@Component({
  selector: 'app-user-detail-modal',
  templateUrl: './user-detail-modal.component.html',
})
export class UserDetailModalComponent implements OnInit {


  readonly modalData: {user: UserDTO} = inject(NZ_MODAL_DATA);

  selectedUser: UserDTO | null = null;
  activeTabIndex = 0;

  statusOptions = [
    { label: 'ACTIVE', value: 'ACTIVE' },
    { label: 'INACTIVE', value: 'INACTIVE' }
  ];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private modalRef: NzModalRef,
  ) {}

  get user(): UserDTO {
    return this.modalData.user;
  }
  set sequence(user: UserDTO) {
    this.modalData.user = user;
  }

  ngOnInit(): void {

  }


  closeModal(): void {
    this.modalRef.destroy();
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
