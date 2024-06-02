import { ApplicationConfig, ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { GlobalErrorHandler } from '../global-error-handler';
import { errorInterceptorInterceptor } from './error-interceptor.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptorInterceptor])),
    provideAnimations(), // required animations providers
    provideToastr(), // Toastr providers
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ]
};
