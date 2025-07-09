import { inject, Injectable } from '@angular/core';
import { HttpService } from '@core/services/http/http.service';
import { BaseResponse } from '@core/models';
import { CredentialModel, SignInResponseModel } from '@core/models/credential.model';
import { UserModel } from '@core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpService);

  signIn(credential: CredentialModel) {
    return this.http.post<CredentialModel, BaseResponse<SignInResponseModel>>('/v1/login', credential);
  }

  checkToken() {
    return this.http.get<BaseResponse<UserModel>>('/v1/check');
  }
}
