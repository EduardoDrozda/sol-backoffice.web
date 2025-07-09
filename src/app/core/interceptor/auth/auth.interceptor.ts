import { HttpEventType, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cloned = req.clone({ withCredentials: true });

  if (!req.url.includes('login')) {
    return next(req);
  }

  return next(cloned);
};
