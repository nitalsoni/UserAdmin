import { Injectable } from '@angular/core';
import { SectorInfo } from '../models/sectorInfo';
import { GlobalVars } from './app.global';
import { Observable } from 'rxjs';
import { Request, RequestHeader } from '../models/Request';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SectorInfoService {

  private localUrl = GlobalVars.baseAppUrl + 'Sector';

  constructor(private http: HttpClient, private globalVar: GlobalVars) { }

  getSectorInfo(userid: string): Observable<Response> {
    let request = new Request();
    let requestParams = request.header.GetHeader();
    requestParams['params'] = { 'userid': userid }
    return this.http.get<Response>(this.localUrl, requestParams);
  }

  addSectorInfo(newSectorInfo: SectorInfo): Observable<Response> {
    let request = new Request();
    let requestParams = request.header.GetHeader();
    return this.http.post<Response>(this.localUrl, newSectorInfo, requestParams);
  }

  deleteConfig(deleteSectorInfo: SectorInfo): Observable<Response> {
    let request = new Request();
    let requestParams = request.header.GetHeader();
    requestParams['body'] = deleteSectorInfo;
    return this.http.delete<Response>(this.localUrl, requestParams);
  }
}
