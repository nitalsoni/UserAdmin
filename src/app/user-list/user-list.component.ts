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


declare var $:any;

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
        if (resp.statusCode == StatusCode.Ok) {
          this.userGeneralInfo = resp.data;
          console.log(`successfully fetched UserGeneralInfo ${resp.data}`);
          throw new Error('Im errorn');
        }
        else {
          console.log(`failed to fetched UserGeneralInfo item ${resp.message}`);
        }
      },
      error: e => console.error('There is an error!', e),
      //complete: () => this.spinner.hide()
    });
  }

  getSectorInfo() {
    this.spinner.show();
    this.sectorInfoService.getSectorInfo(this.searchUserId).subscribe({
      next: (resp: any) => {
        if (resp.statusCode == StatusCode.Ok) {
          this.userSectorInfo = [];
          resp.data.forEach(element => {
            this.userSectorInfo.push(element);
          });
          console.log(`succssfully added sectorInfo ${resp.data}`);
        }
        else {
          console.log(`failed to add sectorInfo item ${resp.message}`);
        }
      },
      error: e => console.error('There is an error!', e),
      complete: () => this.spinner.hide()
    });
  }

  getUsageInfo() {
    this.usageInfoService.getUsageInfo(this.searchUserId).subscribe({
      next: (resp: any) => {
        if (resp.statusCode == StatusCode.Ok) {
          this.usageInfo = [];
          resp.data.forEach(element => {
            this.usageInfo.push(element);
          });
          this.populateBarChart(this.usageInfo);
          console.log(`successfully fetched UsageInfo ${resp.data}`);
        }
        else {
          console.log(`failed to fetched UsageInfo item ${resp.message}`);
        }
      },
      error: e => console.error('There is an error!', e),
      //complete: () => this.spinner.hide()
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
        if (resp.statusCode == StatusCode.Ok) {
          this.userSectorInfo.push(response.data);
          console.log(`succssfully added sectorInfo ${resp.data}`);
        }
        else {
          console.log(`failed to add sectorInfo item ${resp.message}`);
        }
      },
      error: e => console.error('There is an error!', e),
      complete: () => this.spinner.hide()
    });
  }

  public userModalCallback: (response: any) => void = (response) =>{
    this.spinner.show();
    response.service.createNewUser(response.data).subscribe({
      next: (resp: any) =>{
        if (resp.statusCode == StatusCode.Ok) {
          console.log(`succssfully added user ${resp.data}`);
        }
        else {
          console.log(`failed to add user item ${resp.message}`);
        }
      },
      error: e => console.error(`there is an error!`, e),
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
