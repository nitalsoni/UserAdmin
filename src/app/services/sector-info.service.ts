import { Injectable } from '@angular/core';
import { SectorInfo } from '../models/sectorInfo';
import { GlobalVars } from './app.global';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SectorInfoService {

  private localUrl = GlobalVars.baseAppUrl + 'Sector';

  constructor(private http: HttpClient, private globalVar: GlobalVars) { }

  getSectorInfo(userid: string): Observable<Response> {

    let params = new HttpParams().append('userid', userid);
    return this.http.get<Response>(this.localUrl, { params: params });
  }

  addSectorInfo(newSectorInfo: SectorInfo): Observable<Response> {
    return this.http.post<Response>(this.localUrl, newSectorInfo);
  }

  deleteSector(deleteSectorInfo: SectorInfo): Observable<Response> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: deleteSectorInfo,
    };
    return this.http.delete<Response>(this.localUrl, options);
  }
}
