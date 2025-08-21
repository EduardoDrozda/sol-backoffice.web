import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { PaginationRequestModel, PaginationResponseModel, RoleModel } from '@core/models';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private readonly apiUrl = '/v1/roles';
  private readonly http = inject(HttpService);

  getAll(params?: PaginationRequestModel) {
    const query = new URLSearchParams();
    query.set('page', params?.page.toString() ?? '1');
    query.set('limit', params?.limit.toString() ?? '1000');
    query.set('sort', params?.sort ?? 'name:asc');
    query.set('search', params?.search ?? '');
    query.set('order', params?.order ?? 'asc');


    return this.http.get<PaginationResponseModel<RoleModel>>(`${this.apiUrl}?${query.toString()}`).pipe(
      map((response) => response.result)
    );
  }

  getAllSimple() {
    return this.http.get<RoleModel[]>(`${this.apiUrl}/all`).pipe(
      map((response) => response.result)
    );
  }

  create(role: Partial<RoleModel>) {
    return this
      .http
      .post<Partial<RoleModel>, RoleModel>(this.apiUrl, role)
      .pipe(
        map((response) => response.result)
      );
  }

  update(id: string, role: Partial<RoleModel>) {
    return this
      .http
      .patch<Partial<RoleModel>, RoleModel>(`${this.apiUrl}/${id}`, role)
      .pipe(
        map((response) => response.result)
      );
  }

  delete(id: string) {
    return this
      .http
      .delete<RoleModel>(`${this.apiUrl}/${id}`)
      .pipe(
        map((response) => response.result)
      );
  }
}
