import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry, tap, finalize } from 'rxjs/operators';
import { HttpHelper } from "../common/HttpHelper";
import { GlobalEventService } from './global-event.service';

@Injectable({
  providedIn: 'root'
})

export class AppHttpInterceptorService implements HttpInterceptor {
  count = 0;

  constructor(private spinner$: GlobalEventService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.count++;
    this.spinner$.spinner.next('show');
    request = HttpHelper.GetRequestHeader(request);
    return next.handle(request).pipe(
      retry(0),
      catchError(this.handleError),
      finalize(() => {
        this.count--;
        if (this.count == 0)
          this.spinner$.spinner.next('hide');
      })
    )
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error instanceof HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      }
      else {
        switch (error.status) {
          case 401:
          case 403:
          case 404: {
            errorMessage = `Error series 4** received --> ${error.status}`;
            return throwError(errorMessage);
          }
          case 500: {
            errorMessage = `Error Code: ${error.status} message: ${error.error}`;
            return throwError(errorMessage);
          }
          default: {
            errorMessage = `Error Code: ${error.status} Message: ${error.statusText}`;
            return throwError(errorMessage);
          }
        }
      }
    }
    else {
      errorMessage = 'some unknown error has occured';
    }
  }
}
