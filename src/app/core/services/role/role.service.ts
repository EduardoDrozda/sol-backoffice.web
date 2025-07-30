import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { PaginationResponseModel, RoleModel } from '@core/models';
import { map } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private readonly apiUrl = '/v1/roles';
  private readonly http = inject(HttpService);

  getAllRoles() {
    const query = new URLSearchParams();
    query.set('page', '1');
    query.set('limit', '1000');
    query.set('sort', 'name:asc');
    query.set('search', '');

    return this.http.get<PaginationResponseModel<RoleModel>>(`${this.apiUrl}?${query.toString()}`).pipe(
      map((response) => response.result?.data ?? [])
    );
  }
}
