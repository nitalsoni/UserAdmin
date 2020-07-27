import { Injectable } from '@angular/core';
import { UserGeneralInfo } from '../models/UserGeneralInfo';
import { UsageInfo } from '../models/UsageInfo';
import { GlobalVars } from './app.global';
import { Observable } from 'rxjs';
import { Request, RequestHeader } from '../models/Request';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  private localUrl = GlobalVars.baseAppUrl + 'UserGeneralInfo';
  constructor(private http: HttpClient, private globalVar: GlobalVars) { 
  }

  getGeneralInfo(userId: string): Observable<Response> {
    let request = new Request();
    let requestParams = request.header.GetHeader();
    requestParams['params'] = { 'userid': userId }
    return this.http.get<Response>(this.localUrl, requestParams);
  }
}
