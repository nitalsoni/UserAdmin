import { Injectable } from '@angular/core';
import { NewUser } from '../models/NewUser';
import { GlobalVars } from './app.global';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private localUrl = GlobalVars.baseAppUrl + 'User';
  constructor(private http: HttpClient, private globalVar: GlobalVars) {
  }

  getAllUserId(): Observable<Response> {
    return this.http.get<Response>(this.localUrl);
  }

  createNewUser(newUser: NewUser) {
    return this.http.post<Response>(this.localUrl, newUser);
  }
}