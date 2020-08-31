import { Component, OnInit, ViewChild } from '@angular/core';
import { ActiveUser } from '../models/activeUser';
import { IOIInfo } from '../models/IOIInfo';
import { DashboardService } from "../services/dashboard.service";
import { GlobalEventService } from '../services/global-event.service';
import { ToastrInfo } from '../models/ToastrInfo';
import { AllCommunityModules } from 'ag-grid-community/dist/ag-grid-community';
import { GridOptions } from 'ag-grid-community';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { Chart, ChartOptions, ChartType, ChartDataSets } from 'chart.js'
import { Helper } from '../common/helper';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  barchart: any;
  userGridOption: GridOptions;
  public modules: any[] = AllCommunityModules;
  private context;
  private frameworkComponents;
  @ViewChild('userGrid', { static: false }) userGrid: AgGridAngular;

  constructor(private dashboard$: DashboardService, private globalEvent$: GlobalEventService) {

  }

  ngOnInit() {
    this.context = { componentParent: this };
    this.frameworkComponents = {};
    this.userGridOption = this.initUserGrid();
    this.initBarChart();

    this.dashboard$.getActiveUserInfo().subscribe({
      next: (resp: any) => {
        this.userGridOption.rowData = [];
        resp.forEach(s => {
          this.userGridOption.rowData.push(s);
          console.log(s);
        });
        this.userGridOption.api.setRowData(this.userGridOption.rowData);
        console.log(`successfully fetched dashboard info ${resp}`);
      },
      error: e => {
        this.globalEvent$.notification.next(new ToastrInfo('error', 'Failed to fetch Dashboard data'));
      },
    });

    this.dashboard$.getIOIUserInfo().subscribe({
      next: (resp: any) => {
        let data: any[] = [];
        debugger;
        resp.forEach(s => {
          data.push(s);
        });
        this.updateBarChart(data);
        console.log(`successfully fetched sectorInfo ${resp}`);
      },
      error: e => {
        this.globalEvent$.notification.next(new ToastrInfo('error', 'Failed to fetch sector list'));
      },
    });
  }

  onGridReady(params) {
    params.api.sizeColumnsToFit();
  }

  initUserGrid(): GridOptions {
    return <GridOptions>{
      pagination: true,
      paginationPageSize: 20,
      defaultColDef: { resizable: true },
      rowData: [],
      columnDefs: [
        { headerName: 'User Id', field: 'userId', sortable: true, filter: 'agTextColumnFilter', minWidth: 200, cellClass: ['hand-pointer'] },
        { headerName: 'Host Name', field: 'hostName', sortable: true, filter: 'agTextColumnFilter', minWidth: 200, cellClass: ['hand-pointer'] },
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

  initBarChart() {
    this.barchart = new Chart('canvasIOI', {
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

  updateBarChart(ioiData: any[]) {
    let data: any[];
    let senders = [];
    let ioiCount = [];

    this.barchart.data.labels = ioiData.map(({ sender }) => sender);
    this.barchart.data.datasets.forEach((dataset) => {
      dataset.data = [];
      dataset.data.push(...ioiData.map(({ count }) => count));
    });

    this.barchart.update();
  }
}
