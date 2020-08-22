import { Injectable } from '@angular/core';
import { UsageInfo } from '../models/UsageInfo';
import { GlobalVars } from './app.global';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ScreenConfigItemService {

  private localUrl = GlobalVars.baseAppUrl + 'ScreenConfigItem';

  constructor(private http: HttpClient, private globalVar: GlobalVars) {
  }

  getAllControlNames(): Observable<Response> {
    return this.http.get<Response>(this.localUrl);
  }
  
}