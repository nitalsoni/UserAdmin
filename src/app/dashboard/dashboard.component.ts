import { Component, OnInit, ViewChild } from '@angular/core';
import { ActiveUser } from '../models/activeUser';
import { IOIInfo } from '../models/IOIInfo';
import { DashboardService } from "../services/dashboard.service";
import { GlobalEventService } from '../services/global-event.service';
import { ToastrInfo } from '../models/ToastrInfo';
import { AllCommunityModules } from 'ag-grid-community/dist/ag-grid-community';
import { GridOptions } from 'ag-grid-community';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
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
    this.initUserGrid();

    this.dashboard$.getActiveUserInfo().subscribe({
      next: (resp: any) => {
        this.userGridOption.rowData = [];
        resp.forEach(s => {
          this.userGridOption.rowData.push(s);
          console.log(s);
        });
        this.userGridOption.api.setRowData(this.userGridOption.rowData);
        console.log(`successfully fetched sectorInfo ${resp}`);
      },
      error: e => {
        this.globalEvent$.notification.next(new ToastrInfo('error', 'Failed to fetch sector list'));
      },
    });

    this.dashboard$.getIOIUserInfo().subscribe({
      next: (resp: any) => {
        //this.sectorGridOption.rowData = [];
        resp.forEach(s => {
          //this.sectorGridOption.rowData.push(s);
          console.log(s);
        });
        //this.sectorGridOption.api.setRowData(this.sectorGridOption.rowData);
        console.log(`successfully fetched sectorInfo ${resp}`);
      },
      error: e => {
        this.globalEvent$.notification.next(new ToastrInfo('error', 'Failed to fetch sector list'));
      },
    });
  }

  initUserGrid(): GridOptions {
    return <GridOptions>{
      pagination: true,
      paginationPageSize: 20,
      defaultColDef: { resizable: true },
      rowData: [],
      columnDefs: [
        { headerName: 'UserId', field: 'userid', sortable: true, filter: 'agTextColumnFilter', minWidth: 200, cellClass: ['hand-pointer'] },
        { headerName: 'Host Name', field: 'hostname', sortable: true, filter: 'agTextColumnFilter', minWidth: 200, cellClass: ['hand-pointer'] },
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

}
