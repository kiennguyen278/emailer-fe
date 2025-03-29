import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '@modules/auth/service/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const redirectUrl: string = state.url === '/auth/logout' ? '/' : state.url;
    return this._check(redirectUrl);
  }

  private _check(redirectURL: string): Observable<boolean> {
    // Check the authentication status
    return this.authService.check().pipe(
      switchMap((authenticated: boolean) => {
        // If the user is not authenticated...
        if (!authenticated) {
          // Redirect to the sign-in page
          this.router.navigate(['/auth/login'], {
            queryParams: { redirectURL }
          });

          // Prevent the access
          return of(false);
        }
        // Allow the access
        return of(true);
      })
    );
  }
}
