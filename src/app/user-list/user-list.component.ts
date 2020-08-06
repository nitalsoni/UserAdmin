import { Component, OnInit } from '@angular/core';
import { UserGeneralInfo } from '../models/UserGeneralInfo';
import { SectorInfo } from '../models/sectorInfo';
import { UsageInfo } from '../models/UsageInfo';
import { UserInfoService } from '../services/user-info.service';
import { UserService } from '../services/user.service';
import { SectorInfoService } from '../services/sector-info.service'
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";
import * as _ from "lodash";
import { GlobalVars } from '../services/app.global';
import { SharedService } from '../services/shared.service';
import { Subscription } from 'rxjs';
import { Chart, ChartOptions, ChartType, ChartDataSets } from 'chart.js'
import { Label } from 'ng2-charts';
import { Helper } from '../common/helper';
import { AddSectorComponent } from '../add-sector/add-sector.component';
import { AddUserComponent } from '../add-user/add-user.component';
import { Response, StatusCode } from '../models/Response';
import { UsageInfoService } from '../services/usage-info.service';


declare var $: any;

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  searchUserId: string = 'nital';
  openDialogEventsubscription: Subscription;
  userSectorInfo: SectorInfo[] = new Array();
  userGeneralInfo: UserGeneralInfo = new UserGeneralInfo();
  usageInfo: UsageInfo[] = new Array();

  constructor(private userInfoService: UserInfoService, private sectorInfoService: SectorInfoService
    , private usageInfoService: UsageInfoService, private userService: UserService
    , private spinner: NgxSpinnerService, private globalVar: GlobalVars
    , private sharedService: SharedService, private modalService: NgbModal) {
  }

  ngOnInit() {

    this.openDialogEventsubscription = this.sharedService.triggerOpenDialogEvent().subscribe(() => {
      this.openSectorDialog();
    });
  }

  onSearch() {
    this.getSectorInfo();
    this.getUserGeneralInfo();
    this.getUsageInfo();
  }

  getUserGeneralInfo() {
    this.userInfoService.getGeneralInfo(this.searchUserId).subscribe({
      next: (resp: any) => {
        this.userGeneralInfo = resp;
        console.log(`successfully fetched UserGeneralInfo ${resp}`);
      },
      error: e => {
        console.log(`failed to fetch user general Info ${e}`);
      },
    });
  }

  getSectorInfo() {
    this.spinner.show();
    this.sectorInfoService.getSectorInfo(this.searchUserId).subscribe({
      next: (resp: any) => {
        this.userSectorInfo = [];
        resp.forEach(element => {
          this.userSectorInfo.push(element);
        });
        console.log(`succssfully added sectorInfo ${resp}`);
      },
      error: e => {
        console.log(`failed to get sector Info ${e}`);
      },
      complete: () => this.spinner.hide()
    });
  }

  deleteSector(deleteSector: SectorInfo) {
    this.sectorInfoService.deleteSector(deleteSector).subscribe({
      next: (resp: any) => {
        _.remove(this.userSectorInfo, (x) => x.sector.trim() == deleteSector.sector.trim()
          && x.subSector.trim() == deleteSector.subSector.trim());
      },
      error: e => {
        console.log(`failed to  fetch all UserIds ${e}`);
      }
    });
  }

  getUsageInfo() {
    this.usageInfoService.getUsageInfo(this.searchUserId).subscribe({
      next: (resp: any) => {
        this.usageInfo = [];
        resp.forEach(element => {
          this.usageInfo.push(element);
        });
        this.populateBarChart(this.usageInfo);

        console.log(`successfully fetched UsageInfo ${resp}`);
      },
      error: e => {
        console.log(`failed to get Usage Info ${e}`);
      },
    });
  }

  addScreenToUser(screenName) {
    this.userInfoService.addScreenToUser(this.searchUserId, screenName).subscribe({
      next: (resp: any) => {
        _.remove(this.userGeneralInfo.availableScreens, (x) => x.trim() == screenName.trim());
        this.userGeneralInfo.screenList = _.concat(this.userGeneralInfo.screenList, screenName.trim());
      },
      error: e => {
        console.log(`failed to add screen to user ${e}`);
      }
    });
  }

  removeScreen(screenName) {
    this.userInfoService.removeScreenFromUser(this.searchUserId, screenName).subscribe({
      next: (resp: any) => {
        _.remove(this.userGeneralInfo.screenList, (x) => x.trim() == screenName.trim());
        this.userGeneralInfo.availableScreens = _.concat(this.userGeneralInfo.availableScreens, screenName.trim());
      },
      error: e => {
        console.log(`failed to remove screen from user ${e}`);
      }
    });
  }

  openSectorDialog() {
    const modalRef = this.modalService.open(AddSectorComponent, { centered: true });
    modalRef.componentInstance.dataService = this.sectorInfoService;
    modalRef.componentInstance.messageEvent.subscribe(this.sectorModalCallback);
  }

  openUserDialog() {
    const modalRef = this.modalService.open(AddUserComponent, { centered: true });
    modalRef.componentInstance.dataService = this.userService;
    modalRef.componentInstance.messageEvent.subscribe(this.userModalCallback);
  }

  public sectorModalCallback: (response: any) => void = (response) => {
    this.spinner.show();
    response.service.addSectorInfo(response.data).subscribe({
      next: (resp: any) => {
        this.userSectorInfo.push(response.data);
        console.log(`succssfully added sectorInfo ${resp}`);
      },
      error: e => {
        console.log(`failed to add new sector ${e}`);
      },
      complete: () => this.spinner.hide()
    });
  }

  public userModalCallback: (response: any) => void = (response) => {
    this.spinner.show();
    response.service.createNewUser(response.data).subscribe({
      next: (resp: any) => {
        console.log(`succssfully added user ${resp}`);
      },
      error: e => {
        console.log(`failed to create new user ${e}`);
      },
      complete: () => this.spinner.hide()
    });
  }

  populateBarChart(usageData: UsageInfo[]) {
    let data: UsageInfo[];
    let screenNames = [];
    let screenCount = [];
    let barchart: any = [];

    screenNames = usageData.map(({ screenName }) => screenName);
    screenCount = usageData.map(({ usageCount }) => usageCount);

    barchart = new Chart('canvas', {
      type: 'horizontalBar',
      data: {
        labels: screenNames,
        datasets: [
          {
            data: screenCount,
            borderColor: '#3cba9f',
            backgroundColor: Helper.dynamicColors(screenNames.length),
            fill: true
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }],
          ticks: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
