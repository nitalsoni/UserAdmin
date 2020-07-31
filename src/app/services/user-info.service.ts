import { Injectable } from '@angular/core';
import { UserGeneralInfo } from '../models/UserGeneralInfo';
import { UsageInfo } from '../models/UsageInfo';
import { GlobalVars } from './app.global';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  private localUrl = GlobalVars.baseAppUrl + 'UserGeneralInfo';
  constructor(private http: HttpClient, private globalVar: GlobalVars) {
  }

  getGeneralInfo(userId: string): Observable<Response> {
    let params = new HttpParams().append('userid', userId);
    return this.http.get<Response>(this.localUrl, { params: params });
  }

  addScreenToUser(userId: string, screenName: string): Observable<Response> {
    return this.http.post<Response>(this.localUrl, { 'userId': userId, 'screenName': screenName });
  }

  removeScreenFromUser(userId: string, screenName: string): Observable<Response> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: { 'userId': userId, 'screenName': screenName },
    };
    return this.http.delete<Response>(this.localUrl, options);
  }

}
