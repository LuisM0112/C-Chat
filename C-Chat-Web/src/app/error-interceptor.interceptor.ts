import { HttpHandlerFn, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const errorInterceptorInterceptor: HttpInterceptorFn = (req, next: HttpHandlerFn) => {

  const toastr = inject(ToastrService);

  return next(req).pipe(catchError((error) => {
    if (error.status == 0) {
      toastr.error("Failed to connect to server")
    } else {
      toastr.error(error.error)
      console.log(error);
    }
    
    return throwError(() => error);
    
  }));
};
