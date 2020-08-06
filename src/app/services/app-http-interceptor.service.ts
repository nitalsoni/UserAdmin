import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { HttpHelper } from "../common/HttpHelper";

@Injectable({
  providedIn: 'root'
})

export class AppHttpInterceptorService implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    request = HttpHelper.GetRequestHeader(request);
    console.log(request);

    return next.handle(request).pipe(
      retry(2),
      catchError(this.handleError)
    );
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
          case 500:{
            errorMessage = `Error Code: ${error.status} \nMessage: ${error.error}`;
            return throwError(errorMessage);
          }
          default: {
            errorMessage = `Error Code: ${error.status} \nMessage: ${error.statusText}`;
            return throwError(errorMessage);
          }
        }
      }
    }
    else {
      errorMessage = 'some unknown error has occured';
    }
  }

  constructor() {
  }
}
