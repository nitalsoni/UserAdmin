import { Injectable } from '@angular/core';
import { GlobalVars } from './app.global';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActiveUser } from '../models/activeUser';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private localUrl = GlobalVars.baseAppUrl + 'Dashboard/';

  constructor(private http: HttpClient, private globalVar: GlobalVars) {
  }

  getActiveUserInfo(): Observable<Response> {
    return this.http.get<Response>(this.localUrl + 'GetActiveUsers');
  }

  getIOIUserInfo(): Observable<Response> {
    return this.http.get<Response>(this.localUrl + 'GetIOIInfo');
  }
}
