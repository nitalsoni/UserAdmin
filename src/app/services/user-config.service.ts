import { Injectable } from '@angular/core';
import { UserConfig } from '../models/userConfig';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalVars } from './app.global';

@Injectable({
  providedIn: 'root'
})
export class UserConfigService {
  private localUrl = GlobalVars.baseAppUrl + 'UserConfig';

  constructor(private http: HttpClient, private globalVar: GlobalVars) {
  }

  searchConfig(searchParams: any): Observable<Response> {
    let params = new HttpParams();
    if (searchParams.globalSearch)
      params = params.append('globalSearch', searchParams.globalSearch);
    if (searchParams.userid)
      params = params.append('userid', searchParams.userid);
    if (searchParams.screen)
      params = params.append('screen', searchParams.screen);

    return this.http.get<Response>(this.localUrl, { params: params });
  }

  addConfig(newConfig: UserConfig): Observable<Response> {
    return this.http.post<Response>(this.localUrl, newConfig);
  }

  editConfig(replaceConfig: UserConfig): Observable<Response> {
    return this.http.put<Response>(this.localUrl, replaceConfig);
  }

  deleteConfig(deleteConfig: UserConfig): Observable<Response> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: deleteConfig,
    };
    return this.http.delete<Response>(this.localUrl, options);
  }
}
