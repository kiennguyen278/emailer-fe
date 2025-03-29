import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FormUtil } from '@core/utils/form.util';
import { ValidatorUtil } from '@core/utils/validator.util';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DataFromToken, TokenStorageService } from '@modules/auth/service/token-storage.service';
import { NotificationService } from '@core/services/notification.service';
import { BaseDestroyComponent } from '@core/components';
import { LoginResponsed } from '@modules/auth/models';
import { takeUntil } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';
import { AuthService } from '@modules/auth/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
// export class LoginComponent implements OnInit, CanComponentDeactivate {
export class LoginComponent extends BaseDestroyComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  constructor(
    private fb: FormBuilder,
    protected router: Router,
    private modal: NzModalService,
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private notification: NotificationService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();

  }

  buildForm() {
    this.form = this.fb.group({
      email: [null, [ValidatorUtil.required('Tên đăng nhập không được để trống')]],
      password: [null, [ValidatorUtil.required('Mật khẩu không được để trống')]],
    });

  }

  onLogin() {

    FormUtil.validate(this.form);

    this.isLoading = true;
    const paramsLogin = this.form.getRawValue();


    // nếu handler thêm case error thì dùng như này:
    this.authService.login(paramsLogin)
      .pipe()
      .subscribe({
        next: (res: LoginResponsed) => {
          this.authService.accessToken = res.data.accessToken;
          const jwtTokenParse = jwt_decode(res.data.accessToken);
          console.log('jwtTokenParse', jwtTokenParse)

          this.goToDashboard();
          this.isLoading = false;
        },
        error: ({error}) => {
          this.isLoading = false;
          this.notification.open({
            type: 'error',
            content: error?.message || 'Đã có lỗi khi đăng nhập',
          });
        }
      });
  }


  goToDashboard(): void {
    this.router.navigate(['/']);
  }

  // canDeactivate() {
  //   // if (this.form.dirty){
  //     const modalRef = this.modal.create({
  //       nzContent: ModalConfirmNavigateComponent,
  //       nzFooter: null,
  //       nzMaskClosable: false,
  //     });
  //
  //     return modalRef.afterClose;
  //
  //   // } else {
  //   //   return true;
  //   // }
  //
  //
  //
  // }


}
