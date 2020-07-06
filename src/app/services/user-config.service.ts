import { Injectable } from '@angular/core';
import { UserConfig } from '../models/userConfig';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Request, RequestHeader } from '../models/Request';

@Injectable({
  providedIn: 'root'
})
export class UserConfigService {

  private _request = new Request();
  private searchResult: UserConfig[] = new Array();
  //private searchParam: string = 'nsoni5';
  private localUrl = 'http://localhost:50197/api/UserConfig';

  constructor(private http: HttpClient) {
  }

  searchConfig(searchClause: string): Observable<Response> {
    let requestParams = this._request.header.GetHeader();
    requestParams['params'] = { 'searchParam': 'nsoni5' }
    return this.http.get<Response>(this.localUrl, requestParams);
  }
}
