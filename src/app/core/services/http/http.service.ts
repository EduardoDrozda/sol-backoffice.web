import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  post<I, O>(url: string, body: I): Observable<O> {
    return this.http.post<O>(`${this.apiUrl}${url}`, body);
  }

  get<O>(url: string): Observable<O> {
    return this.http.get<O>(`${this.apiUrl}${url}`);
  }
}
