import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GlobalErrorHandlerService {
  constructor() { }

  handleError(error: Error | HttpErrorResponse) {
    console.log('GlobalErrorHandlerService');
  }
}
