import { HttpEventType, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cloned = req.clone({ withCredentials: true });

  return next(cloned).pipe(
    tap((event) => {
      if (event.type === HttpEventType.Response) {
        console.log(event.body);
      }
    })
  );
};
