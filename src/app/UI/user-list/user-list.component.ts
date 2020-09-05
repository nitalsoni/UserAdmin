import { Component, OnInit, ViewChild } from '@angular/core';
import { UserGeneralInfo } from '../../models/UserGeneralInfo';
import { SectorInfo } from '../../models/sectorInfo';
import { UsageInfo } from '../../models/UsageInfo';
import { UserInfoService } from '../../services/user-info.service';
import { UserService } from '../../services/user.service';
import { SectorInfoService } from '../../services/sector-info.service'
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";
import  * as _ from "lodash";
import { GlobalVars } from '../../services/app.global';
import { SharedService } from '../../services/shared.service';
import { Subscription } from 'rxjs';
import { Chart, ChartOptions, ChartType, ChartDataSets } from 'chart.js'
import { Label } from 'ng2-charts';
import { Helper } from '../../common/helper';
import { AddSectorComponent } from '../add-sector/add-sector.component';
import { AddUserComponent } from '../add-user/add-user.component';
import { Response, StatusCode } from '../../models/Response';
import { UsageInfoService } from '../../services/usage-info.service';
import { GridOptions } from 'ag-grid-community';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ActionBtnRendererComponent } from '../action-btn-renderer/action-btn-renderer.component';
import { ScreenInfo } from '../../models/ScreenInfo';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalEventService } from '../../services/global-event.service';
import { ToastrInfo } from '../../models/ToastrInfo';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})

export class UserListComponent implements OnInit {
  searchUserId: string = 'sbyrne1';
  openDialogEventsubscription: Subscription;
  userGeneralInfo: UserGeneralInfo = new UserGeneralInfo();
  usageInfo: UsageInfo[] = new Array();
  controlUsageInfo: UsageInfo[] = new Array();
  barchart: any;
  piechart: any;
  selectedDays: number;

  screenGridOption: GridOptions;
  sectorGridOption: GridOptions;

  private context;
  private frameworkComponents;

  @ViewChild('screenGrid', { static: false }) screenGrid: AgGridAngular;
  @ViewChild('sectorGrid', { static: false }) sectorGrid: AgGridAngular;

  constructor(private userInfo$: UserInfoService, private sectorInfo$: SectorInfoService
    , private usageInfo$: UsageInfoService, private user$: UserService
    , private shared$: SharedService, private modal$: NgbModal
    , private activatedroute: ActivatedRoute, private router: Router
    , private globalEvent$: GlobalEventService) {
    this.selectedDays = 30;
  }

  ngOnInit() {
    this.screenGridOption = this.initScreenGrid();
    this.sectorGridOption = this.initSectorGrid();
    this.context = { componentParent: this };
    this.frameworkComponents = { actionBtnRenderer: ActionBtnRendererComponent };
    this.initBarChart();
    this.initPieChart();

    this.openDialogEventsubscription = this.shared$.triggerOpenDialogEvent().subscribe(() => {
      this.onOpenSectorDialog();
    });
  }

  onSearch() {
    this.getSectorInfo();
    this.getUserGeneralInfo();
    this.getUsageInfo();

  }

  onDelete(data: any) {
    if (data.hasOwnProperty('sector')) {
      this.onDeleteSector(data);
    }
    else if (data.hasOwnProperty('name')) {
      this.onDeleteScreen(data);
    }
  }

  onDeleteSector(deleteSector: SectorInfo) {
    this.sectorInfo$.deleteSector(deleteSector).subscribe({
      next: (resp: any) => {
        _.remove(this.sectorGridOption.rowData, (x) => x.sector.trim() == deleteSector.sector.trim()
          && x.subSector.trim() == deleteSector.subSector.trim());
        this.sectorGridOption.api.setRowData(this.sectorGridOption.rowData);
      },
      error: e => {
        this.globalEvent$.notification.next(new ToastrInfo('error', 'Failed to delete sector'));
      },
      complete: () => this.globalEvent$.notification.next(new ToastrInfo('success', 'sector removed from user'))
    });
  }

  onAssignScreen(screen) {
    this.userInfo$.addScreenToUser(this.searchUserId, screen).subscribe({
      next: (resp: any) => {
        _.remove(this.userGeneralInfo.availableScreens, (x) => x.id == screen.id);
        this.screenGridOption.rowData = _.concat(this.screenGridOption.rowData, screen);
        this.screenGridOption.api.setRowData(this.screenGridOption.rowData);
      },
      error: e => {
        this.globalEvent$.notification.next(new ToastrInfo('error', 'Failed to assign screen'));
      }
    });
  }

  onDeleteScreen(screen) {
    this.userInfo$.removeScreenFromUser(this.searchUserId, screen).subscribe({
      next: (resp: any) => {
        _.remove(this.screenGridOption.rowData, (x) => x.id == screen.id);
        this.screenGridOption.api.setRowData(this.screenGridOption.rowData);
        this.userGeneralInfo.availableScreens = _.concat(this.userGeneralInfo.availableScreens, screen);
      },
      error: e => {
        this.globalEvent$.notification.next(new ToastrInfo('error', e, 'Failed !'));
      },
      complete: () => this.globalEvent$.notification.next(new ToastrInfo('success', 'screen removed from user'))
    });
  }

  onOpenSectorDialog() {
    const modalRef = this.modal$.open(AddSectorComponent, { centered: true });
    modalRef.componentInstance.dataService = this.sectorInfo$;
    modalRef.componentInstance.userId = this.searchUserId;
    modalRef.componentInstance.messageEvent.subscribe(this.sectorModalCallback);
  }

  onOpenUserDialog() {
    const modalRef = this.modal$.open(AddUserComponent, { centered: true });
    modalRef.componentInstance.dataService = this.user$;
    modalRef.componentInstance.messageEvent.subscribe(this.userModalCallback);
  }

  onGridReady(params) {
    params.api.sizeColumnsToFit();
  }

  onCellClicked(event) {
    if (event.colDef && event.colDef.headerName && event.colDef.headerName == 'Screen') {
      this.router.navigate(['/config-list', this.searchUserId, event.data.id]);
    }
  }

  onChartClick(userid: string, control: string, days: number) {
    this.usageInfo$.getControlUsageInfo(userid, control, days).subscribe({
      next: (resp: any) => {
        this.controlUsageInfo = [];
        resp.forEach(element => {
          this.controlUsageInfo.push(element);
        });

        this.updatePieChart(this.controlUsageInfo);
        console.log(`successfully fetched UsageInfo ${resp}`);
      },
      error: e => {
        this.globalEvent$.notification.next(new ToastrInfo('error', 'Failed to usage information'));
      },
    });
  }

  public sectorModalCallback: (response: any) => void = (response) => {
    response.service.addSectorInfo(response.data).subscribe({
      next: (resp: any) => {
        if (this.searchUserId == response.data.userId) {
          this.sectorGridOption.rowData.push(response.data);
          this.sectorGridOption.api.setRowData(this.sectorGridOption.rowData);
        }
        this.globalEvent$.notification.next(new ToastrInfo('success', 'successfully added new sector'));
      },
      error: e => {
        this.globalEvent$.notification.next(new ToastrInfo('error', 'Failed to add new sector'));
      },
    });
  }

  public userModalCallback: (response: any) => void = (response) => {
    response.service.createNewUser(response.data).subscribe({
      next: (resp: any) => {
        this.globalEvent$.notification.next(new ToastrInfo('success', 'successfully added new user'));
      },
      error: e => {
        this.globalEvent$.notification.next(new ToastrInfo('error', 'Failed to add new user'));
      },
    });
  }

  getUserGeneralInfo() {
    this.userInfo$.getGeneralInfo(this.searchUserId).subscribe({
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
        this.globalEvent$.notification.next(new ToastrInfo('error', 'Failed to fetch user info'));
      },
    });
  }

  getSectorInfo() {
    this.sectorInfo$.getSectorInfo(this.searchUserId).subscribe({
      next: (resp: any) => {
        this.sectorGridOption.rowData = [];
        resp.forEach(s => {
          this.sectorGridOption.rowData.push(s);
        });
        this.sectorGridOption.api.setRowData(this.sectorGridOption.rowData);
        console.log(`successfully fetched sectorInfo ${resp}`);
      },
      error: e => {
        this.globalEvent$.notification.next(new ToastrInfo('error', 'Failed to fetch sector list'));
      },
    });
  }

  getUsageInfo() {
    this.clearPieChart();
    this.usageInfo$.getUsageInfo(this.searchUserId, this.selectedDays).subscribe({
      next: (resp: any) => {
        this.usageInfo = [];
        resp.forEach(element => {
          this.usageInfo.push(element);
        });
        this.updateBarChart(this.usageInfo);
        console.log(`successfully fetched UsageInfo ${resp}`);
      },
      error: e => {
        this.globalEvent$.notification.next(new ToastrInfo('error', 'Failed to usage information'));
      },
    });
  }

  initScreenGrid(): GridOptions {
    return <GridOptions>{
      pagination: true,
      paginationPageSize: 15,
      defaultColDef: { resizable: true },
      rowData: [],
      columnDefs: [
        { headerName: 'Screen', field: 'name', sortable: true, filter: 'agTextColumnFilter', minWidth: 200, cellClass: ['hand-pointer'] },
        { headerName: 'Delete', cellRenderer: 'actionBtnRenderer', colId: 'delete', width: 40, cellClass: ['ag-grid-btn-cell'] },
        // {
        //   headerName: 'Screen Href', colId: 'name', cellRenderer: function (params) {
        //     // let newLink =
        //     //   `<a href= "/config-list/sbyrne1;id=${params.data.id};name=${params.data.name}">${params.data.name}</a>`;
        //     // return newLink;
        //   }
        // }
      ],
    };
  }

  initSectorGrid(): GridOptions {
    return <GridOptions>{
      pagination: true,
      paginationPageSize: 5,
      defaultColDef: { resizable: true },
      rowData: [],
      columnDefs: [
        { headerName: 'Sector', field: 'sector', sortable: true, filter: 'agTextColumnFilter' },
        { headerName: 'Sub Sector', field: 'subSector', sortable: true, filter: 'agTextColumnFilter' },
        { headerName: 'Account', field: 'account', sortable: true, filter: 'agTextColumnFilter' },
        { headerName: 'Delete', cellRenderer: 'actionBtnRenderer', colId: 'delete', cellClass: ['ag-grid-btn-cell'] },
      ],
    }
  }

  initBarChart() {
    this.barchart = new Chart('canvasUsage', {
      type: 'horizontalBar',
      data: {
        labels: [],
        datasets: [
          {
            data: [],
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
        onClick: (evt) => {
          let bar = this.barchart.getElementAtEvent(evt);
          if (bar.length > 0) {
            var screenName = bar[0]._model.label;
            this.onChartClick(this.searchUserId, screenName, this.selectedDays);
          }
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

  initPieChart() {
    this.piechart = new Chart('canvasFeature', {
      type: 'doughnut',
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            borderColor: 'rgba(0, 0, 0, 1)',
            backgroundColor: Helper.GetBarColors(),
            borderWidth: 0.6,
            fill: true
          }
        ]
      },
      options: {
        legend: {
          display: true
        },
        scales: {
          xAxes: [{
            display: false,
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
    this.piechart.update();
  }

  updatePieChart(usageData: UsageInfo[]) {
    let data: UsageInfo[];
    let feature = [];
    let screenCount = [];

    feature = usageData.map(({ feature }) => feature);
    screenCount = usageData.map(({ usageCount }) => usageCount);
    this.piechart.data.labels = feature;
    this.piechart.data.datasets.forEach((dataset) => {
      dataset.data = [];
      dataset.data.push(...screenCount);
    });

    this.piechart.update();
  }

  updateBarChart(usageData: UsageInfo[]) {
    let data: UsageInfo[];
    let screenNames = [];
    let screenCount = [];

    screenNames = usageData.map(({ screenName }) => screenName);
    screenCount = usageData.map(({ usageCount }) => usageCount);

    this.barchart.data.labels = screenNames;
    this.barchart.data.datasets.forEach((dataset) => {
      dataset.data = [];
      dataset.data.push(...screenCount);
    });

    this.barchart.update();
  }

  clearPieChart() {
    if (this.piechart) {
      this.piechart.data.labels = [];
      this.piechart.data.datasets.forEach((dataset) => {
        dataset.data = [];
      });
      this.piechart.update();
    }

  }
}
