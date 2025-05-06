import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FormUtil } from '@core/utils/form.util';
import { ValidatorUtil } from '@core/utils/validator.util';
import { NotificationService } from '@core/services/notification.service';
import jwt_decode from 'jwt-decode';
import {AuthService} from "@core/services/auth.service";
import {TokenStorageService} from "@core/services/token-storage.service";
import {AuthResponse, LoginResponsed} from "@core/models/auth.models";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  constructor(
    private fb: FormBuilder,
    protected router: Router,
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private notification: NotificationService,
  ) {
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
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: AuthResponse ) => {
          console.log('res', res)
          // this.authService.accessToken = res.data.accessToken;
          const jwtTokenParse: any = jwt_decode(res.loginResponse.data.accessToken);
          console.log('jwtTokenParse', jwtTokenParse)

          const dateExp = new Date(jwtTokenParse.exp * 1000);

          localStorage.setItem('jwtToken', JSON.stringify({...jwtTokenParse, dateExp}));

          console.log('dateExp', dateExp)

          this.tokenStorage.saveUser(res.userInfo);

          this.goToDashboard();
          this.isLoading = false;
        },
        error: ({error}) => {
          this.isLoading = false;
          this.notification.open({
            type: 'error',
            content: error?.message || 'Đã có lỗi khi đăng nhập',
            duration: 5000
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
