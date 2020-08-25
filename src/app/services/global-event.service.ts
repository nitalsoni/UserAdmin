import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastrInfo } from '../models/ToastrInfo';

@Injectable({
  providedIn: 'root'
})
export class GlobalEventService {

  spinner = new Subject<any>();
  notification = new Subject<ToastrInfo>();
  constructor() {
    
  }
}
