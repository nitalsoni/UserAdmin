import { Component, OnInit, ViewChild } from '@angular/core';
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
import { AllCommunityModules } from 'ag-grid-community/dist/ag-grid-community';
import { GridOptions } from 'ag-grid-community';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ActionBtnRendererComponent } from '../action-btn-renderer/action-btn-renderer.component';
import { ScreenInfo } from '../models/ScreenInfo';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})

export class UserListComponent implements OnInit {
  searchUserId: string = 'sbyrne1';
  openDialogEventsubscription: Subscription;
  //userSectorInfo: SectorInfo[] = new Array();
  userGeneralInfo: UserGeneralInfo = new UserGeneralInfo();
  usageInfo: UsageInfo[] = new Array();

  screenGridOption: GridOptions;
  sectorGridOption: GridOptions;

  public modules: any[] = AllCommunityModules;
  private context;
  private frameworkComponents;

  @ViewChild('screenGrid', { static: false }) screenGrid: AgGridAngular;
  @ViewChild('sectorGrid', { static: false }) sectorGrid: AgGridAngular;

  constructor(private userInfoService: UserInfoService, private sectorInfoService: SectorInfoService
    , private usageInfoService: UsageInfoService, private userService: UserService
    , private spinner: NgxSpinnerService, private globalVar: GlobalVars
    , private sharedService: SharedService, private modalService: NgbModal) {

  }

  ngOnInit() {
    this.screenGridOption = this.initScreenGrid();
    this.sectorGridOption = this.initSectorGrid();
    this.context = { componentParent: this };
    this.frameworkComponents = { actionBtnRenderer: ActionBtnRendererComponent };

    this.openDialogEventsubscription = this.sharedService.triggerOpenDialogEvent().subscribe(() => {
      this.openSectorDialog();
    });
  }

  onSearch() {
    this.getSectorInfo();
    this.getUserGeneralInfo();
    this.getUsageInfo();
  }

  onDelete(data: any) {
    debugger;
    if (data.hasOwnProperty('sector')) {
      this.deleteSector(data);
    }
    else if (data.hasOwnProperty('name')) {
      this.onDeleteScreen(data);
    }
  }

  getUserGeneralInfo() {
    this.userInfoService.getGeneralInfo(this.searchUserId).subscribe({
      next: (resp: any) => {
        this.userGeneralInfo = resp;
        this.screenGridOption.rowData = [];
        resp.screenList.forEach(s => {
          this.screenGridOption.rowData.push(s);
        });
        this.screenGridOption.api.setRowData(this.screenGridOption.rowData);
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
        this.sectorGridOption.rowData = [];
        resp.forEach(s => {
          this.sectorGridOption.rowData.push(s);
        });
        this.sectorGridOption.api.setRowData(this.sectorGridOption.rowData);
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
        debugger;
        _.remove(this.sectorGridOption.rowData, (x) => x.sector.trim() == deleteSector.sector.trim()
          && x.subSector.trim() == deleteSector.subSector.trim());
        this.sectorGridOption.api.setRowData(this.sectorGridOption.rowData);
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

  addScreenToUser(screen) {
    this.userInfoService.addScreenToUser(this.searchUserId, screen).subscribe({
      next: (resp: any) => {
        _.remove(this.userGeneralInfo.availableScreens, (x) => x.id == screen.id);
        this.screenGridOption.rowData = _.concat(this.screenGridOption.rowData, screen);
        this.screenGridOption.api.setRowData(this.screenGridOption.rowData);
      },
      error: e => {
        console.log(`failed to add screen to user ${e}`);
      }
    });
  }

  onDeleteScreen(screen) {
    this.userInfoService.removeScreenFromUser(this.searchUserId, screen).subscribe({
      next: (resp: any) => {
        _.remove(this.screenGridOption.rowData, (x) => x.id == screen.id);
        this.screenGridOption.api.setRowData(this.screenGridOption.rowData);
        this.userGeneralInfo.availableScreens = _.concat(this.userGeneralInfo.availableScreens, screen);
      },
      error: e => {
        console.log(`failed to remove screen from user ${e}`);
      }
    });
  }

  openSectorDialog() {
    const modalRef = this.modalService.open(AddSectorComponent, { centered: true });
    modalRef.componentInstance.dataService = this.sectorInfoService;
    modalRef.componentInstance.userId = this.searchUserId;
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
        if (this.searchUserId == response.data.userId) {
          this.sectorGridOption.rowData.push(response.data);
          this.sectorGridOption.api.setRowData(this.sectorGridOption.rowData);
        }
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

  initScreenGrid(): GridOptions {
    return <GridOptions>{
      pagination: true,
      paginationPageSize: 10,
      defaultColDef: { resizable: true },
      rowData: [],
      columnDefs: [
        { headerName: 'Screen', field: 'name', sortable: true, filter: 'agTextColumnFilter', minWidth: 200 },
        { headerName: 'Delete', cellRenderer: 'actionBtnRenderer', colId: 'delete', minWidth: 80, cellClass: ['ag-grid-btn-cell'] },
      ],
    };
  }

  initSectorGrid(): GridOptions {
    return <GridOptions>{
      pagination: true,
      paginationPageSize: 10,
      defaultColDef: { resizable: true },
      rowData: [],
      columnDefs: [
        { headerName: 'Sector', field: 'sector', sortable: true, filter: 'agTextColumnFilter', minWidth: 150 },
        { headerName: 'Sub Sector', field: 'subSector', sortable: true, filter: 'agTextColumnFilter', minWidth: 150 },
        { headerName: 'Account', field: 'account', sortable: true, filter: 'agTextColumnFilter', minWidth: 60 },
        { headerName: 'Delete', cellRenderer: 'actionBtnRenderer', colId: 'delete', minWidth: 80, cellClass: ['ag-grid-btn-cell'] },
      ],
    }
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
            borderColor: 'rgba(0, 0, 0, 1)',
            backgroundColor: Helper.GetBarColors(),
            borderWidth: 0.6,
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
            display: true,
            ticks: {
              beginAtZero: true
            }
          }],
          yAxes: [{
            display: true
          }],
        }
      }
    });
  }
}
