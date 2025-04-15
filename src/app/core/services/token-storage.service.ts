import {Injectable} from '@angular/core';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY } from '@core/constants/local-storage.constants.key';
import {UserInfo} from "@core/models/auth.models";
import {AuthService} from "@core/services/auth.service";
import {NotificationService} from "@core/services/notification.service";
import {Router} from "@angular/router";


const TOKEN_KEY = ACCESS_TOKEN_KEY;
const REFRESH_TOKEN = REFRESH_TOKEN_KEY


export interface DataFromToken{
  sub: string,
  iat: number,
  exp: number
}

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor(
    private notification: NotificationService,
    private router: Router,
  ) {}

  signOut(): void {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }


  public saveUser(user: UserInfo): void {
    // const userParse = jwt_decode(user)
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }


  public getUser(): UserInfo {
    const user = localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {} as UserInfo ;
  }

}
