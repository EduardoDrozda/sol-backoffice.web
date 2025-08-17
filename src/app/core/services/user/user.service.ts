import { inject, Injectable, signal } from '@angular/core';
import { HttpService } from '../http/http.service';
import { UserModel } from '@core/models/user.model';
import { PaginationRequestModel, PaginationResponseModel } from '@core/models/pagination.model';
import { BaseResponse } from '@core/models';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpService);
  private readonly baseUrl = '/v1/users';

  getAll(request: PaginationRequestModel) {
    const queryParams = new URLSearchParams();
    if (request.search) {
      queryParams.set('search', request.search);
    }
    if (request.sort) {
      queryParams.set('sort', request.sort);
    }
    if (request.order) {
      queryParams.set('order', request.order);
    }

    queryParams.set('page', request.page.toString());
    queryParams.set('limit', request.limit.toString());

    return this
      .http
      .get<PaginationResponseModel<UserModel>>(`${this.baseUrl}?${queryParams.toString()}`)
      .pipe(
        map((response) => response)
      );
  }

  toggleStatus(id: string, status: boolean) {
    return this
      .http
      .patch<{ isActive: boolean }, UserModel>(`${this.baseUrl}/${id}/toggle-status`, { isActive: status })
      .pipe(
        map((response) => response.result)
      );
  }

  create(user: UserModel) {
    return this
      .http
      .post<UserModel, UserModel>(this.baseUrl, user)
      .pipe(
        map((response) => response.result)
      );
  }
}
