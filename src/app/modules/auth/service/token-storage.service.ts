import {Injectable} from '@angular/core';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, ROLE_KEY, USER_KEY } from '@core/constants/local-storage.constants.key';
import { ItemUser } from '@modules/user-role/user-manager/models';
// import {ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, ROLE_KEY, USER_KEY} from "@core/constants";
// import {LocalStorageUtil} from "@core/utils";

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
  constructor() {
  }

  signOut(): void {
    localStorage.clear();
  }


  public saveUser(user: ItemUser): void {
    // const userParse = jwt_decode(user)
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }


  public getUser(): ItemUser {
    const user = localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {} as ItemUser;
  }

}
