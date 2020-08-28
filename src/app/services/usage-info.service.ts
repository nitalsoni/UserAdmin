import { Injectable } from '@angular/core';
import { UsageInfo } from '../models/UsageInfo';
import { GlobalVars } from './app.global';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class UsageInfoService {

  private localUrl = GlobalVars.baseAppUrl + 'UsageInfo';

  constructor(private http: HttpClient, private globalVar: GlobalVars) {
  }

  getUsageInfo(userId: string, days: number): Observable<Response> {
    let params = new HttpParams().set('userid', userId)
      .set('days', days.toString());
    return this.http.get<Response>(this.localUrl, { params: params });
  }

  getControlUsageInfo(userId: string,control: string, days: number): Observable<Response> {
    let params = new HttpParams().set('userid', userId)
      .set('control', control)
      .set('days', days.toString());
    return this.http.get<Response>(this.localUrl + '/GetByControl', { params: params });
  }
}
