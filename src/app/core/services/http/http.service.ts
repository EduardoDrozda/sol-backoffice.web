import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseResponse } from '@core/models';
import { environment } from '@environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  post<I, O>(url: string, body: I): Observable<BaseResponse<O>> {
    return this.http.post<BaseResponse<O>>(`${this.apiUrl}${url}`, body);
  }

  get<O>(url: string): Observable<BaseResponse<O>> {
    return this.http.get<BaseResponse<O>>(`${this.apiUrl}${url}`);
  }

  patch<I, O>(url: string, body: I): Observable<BaseResponse<O>> {
    return this.http.patch<BaseResponse<O>>(`${this.apiUrl}${url}`, body);
  }

  delete<O>(url: string): Observable<BaseResponse<O>> {
    return this.http.delete<BaseResponse<O>>(`${this.apiUrl}${url}`);
  }
}
