import { Injectable } from '@angular/core';
import { UserConfig } from '../models/userConfig';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Request, RequestHeader } from '../models/Request';

@Injectable({
  providedIn: 'root'
})
export class UserConfigService {


  private searchResult: UserConfig[] = new Array();
  private localUrl = 'http://localhost:50197/api/UserConfig';

  constructor(private http: HttpClient) {

  }

  searchConfig(searchClause: string): Observable<Response> {
    let request = new Request();
    let requestParams = request.header.GetHeader();
    requestParams['params'] = { 'searchParam': searchClause }
    return this.http.get<Response>(this.localUrl, requestParams);
  }

  addConfig(newConfig: UserConfig): Observable<Response> {
    let request = new Request();
    let requestParams = request.header.GetHeader();
    return this.http.post<Response>(this.localUrl, newConfig, requestParams);
  }

  editConfig(replaceConfig: UserConfig): Observable<Response> {
    let request = new Request();
    let requestParams = request.header.GetHeader();
    return this.http.put<Response>(this.localUrl, replaceConfig, requestParams);
  }

  deleteConfig(deleteConfig: UserConfig): Observable<Response> {
    let request = new Request();
    let requestParams = request.header.GetHeader();
    return this.http.post<Response>("http://localhost:50197/api/UserConfig/DeleteConfig", deleteConfig, requestParams);
  }
}
