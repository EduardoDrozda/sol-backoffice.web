import { inject, Injectable } from '@angular/core';
import { HttpService } from '@core/services/http/http.service';
import { BaseResponse } from '@core/models';
import { CredentialModel, SignInResponseModel } from '@core/models/credential.model';
import { UserModel } from '@core/models/user.model';
import { Router } from '@angular/router';
import { RoutesEnum } from '@core/enums/routes.enum';
import { ToastService } from '@shared/modules/toast/toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  private readonly AUTH_TOKEN_KEY = 'auth_token';

  signIn(credential: CredentialModel) {
    return this.http.post<CredentialModel, BaseResponse<SignInResponseModel>>('/v1/login', credential);
  }

  checkToken() {
    return this.http.get<BaseResponse<UserModel>>('/v1/check');
  }

  logout() {
    this.http.post('/v1/logout', {}).subscribe({
      next: () => {
        this.clearAuthData();
        this.toast.showSuccess('Logout realizado com sucesso');
        this.router.navigate([RoutesEnum.SIGN_IN]);
      },
      error: () => {
        this.clearAuthData();
        this.router.navigate([RoutesEnum.SIGN_IN]);
      }
    });
  }

  private clearAuthData() {
    this.removeCookie(this.AUTH_TOKEN_KEY);
  }

  private removeCookie(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
    if (window.location.protocol === 'https:') {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure;`;
    }
  }
}
