import { HttpErrorResponse } from "@angular/common/http";
import { ErrorHandler, Injectable } from "@angular/core";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  handleError(error: any): void {
    if (error as HttpErrorResponse && !error.error) {
      console.error(error);
    }
  }

}