import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-left-menu',
  templateUrl: './app-left-menu.component.html',
  styleUrls: ['./app-left-menu.component.css']
})
export class AppLeftMenuComponent implements OnInit {
  activeTab: string;

  constructor(private sharedService: SharedService) { }

  ngOnInit() {
    this.activeTab = 'configSearch';
  }

  addUserConfig() {
    this.sharedService.sendOpenDialogEvent();
    return false;
  }

}
