import { Injectable } from '@angular/core';
import { UserConfig } from '../models/userConfig';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalVars } from './app.global';

@Injectable({
  providedIn: 'root'
})
export class UserConfigService {
  private localUrl = GlobalVars.baseAppUrl + 'UserConfig';

  constructor(private http: HttpClient, private globalVar: GlobalVars) {
  }

  searchConfig(searchClause: string): Observable<Response> {
    let params = new HttpParams().append('searchParam', searchClause);
    return this.http.get<Response>(this.localUrl, { params: params });
  }

  addConfig(newConfig: UserConfig): Observable<Response> {
    return this.http.post<Response>(this.localUrl, newConfig);
  }

  editConfig(replaceConfig: UserConfig): Observable<Response> {
    return this.http.put<Response>(this.localUrl, replaceConfig);
  }

  deleteConfig(deleteConfig: UserConfig): Observable<Response> {
    // let request = new Request();
    // let requestParams = request.header.GetHeader();
    // requestParams['body'] = deleteConfig;
    const options = {
      body: deleteConfig
    }
    //return this.http.delete<Response>(this.localUrl, {params: options});
    return null;
  }
}
