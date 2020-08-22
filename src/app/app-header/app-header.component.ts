import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { GlobalVars } from '../services/app.global';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent implements OnInit {
  private storageKey: string = 'headerSelection';

  constructor(private globalVar: GlobalVars, @Inject(LOCAL_STORAGE) private storage: StorageService) {
    if (this.storage.get(this.storageKey)) {
      this.globalVar = this.storage.get(this.storageKey);
    }
  }

  setLocalStorage() {
    this.storage.set(this.storageKey, this.globalVar);
  }

  ngOnInit() {
  }

}
