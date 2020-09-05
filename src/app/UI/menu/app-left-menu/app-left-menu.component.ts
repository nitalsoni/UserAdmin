import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { Location } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: 'app-left-menu',
  templateUrl: './app-left-menu.component.html',
  styleUrls: ['./app-left-menu.component.css']
})
export class AppLeftMenuComponent implements OnInit {
  //activeTab: string;
  route: string;

  constructor(private sharedService: SharedService, private location: Location, private router: Router) {
    router.events.subscribe(val => {
      if (val["routerEvent"]) {
        this.route = val["routerEvent"]["urlAfterRedirects"];
        //console.log(location.path() + " --> " + this.route);
      }
    });
  }

  ngOnInit() {
    //this.activeTab = 'configSearch';
  }

  addUserConfig() {
    this.sharedService.sendOpenDialogEvent();
    return false;
  }

}
