import { Component, OnInit, ViewChild } from '@angular/core';
import { UserConfig } from '../models/userConfig';
import { UserConfigService } from '../services/user-config.service';
import { AddConfigModalComponent } from '../add-config-modal/add-config-modal.component'
import { Response, StatusCode } from '../models/Response';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
//import { NgxSpinnerService } from "ngx-spinner";
import * as _ from "lodash";
import { GlobalVars } from '../services/app.global';
import { SharedService } from '../services/shared.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Column } from 'ag-grid-community';
import { AllCommunityModules } from 'ag-grid-community/dist/ag-grid-community';
import { GridOptions } from 'ag-grid-community';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ActionBtnRendererComponent } from '../action-btn-renderer/action-btn-renderer.component';
import { GlobalEventService } from '../services/global-event.service';
import { ToastrInfo } from '../models/ToastrInfo';

@Component({
  selector: 'app-config-list',
  templateUrl: './config-list.component.html',
  styleUrls: ['./config-list.component.css']
})

export class UsersComponent implements OnInit {
  openDialogEventsubscription: Subscription;
  gridOptions: GridOptions;
  globalSearch: string;
  routerParam = { "userId": '', "screenId": -1 };
  @ViewChild('configGrid', { static: false }) configGrid: AgGridAngular;

  public modules: any[] = AllCommunityModules;
  private context;
  private frameworkComponents;

  options = {
    autoClose: false,
    keepAfterRouteChange: true
  };

  constructor(private userConfig$: UserConfigService, private modal$: NgbModal
    , private globalVar: GlobalVars, private shared$: SharedService , private activatedroute: ActivatedRoute
    , private router: Router, private globalEvent$: GlobalEventService) {
  }

  ngOnInit() {
    this.gridOptions = this.initGrid();
    this.context = { componentParent: this };
    this.frameworkComponents = { actionBtnRenderer: ActionBtnRendererComponent };
    this.activatedroute.paramMap.subscribe(params => {
      if (params.keys.length > 0) {
        if (params.get('userid'))
          this.routerParam.userId = params.get('userid');
        if (params.get('screenid'))
          this.routerParam.screenId = +params.get('screenid');

        this.onSearch();
      }
    });
  }

  onGridReady(params) {
    params.api.sizeColumnsToFit();
    // this.gridApi = params.api;
    // this.gridColumnApi = params.columnApi;
  }

  //On Add or Edit event
  onOpenConfigDialog(editConfig?: UserConfig) {
    const modalRef = this.modal$.open(AddConfigModalComponent, { centered: true });

    //to check if action is add or edit
    if (_.isNull(editConfig) == null || _.isUndefined(editConfig))
      modalRef.componentInstance.config = new UserConfig();
    else
      modalRef.componentInstance.config = editConfig;

    modalRef.componentInstance.dataService = this.userConfig$;
    modalRef.componentInstance.messageEvent.subscribe(this.modalCallback);
  }

  onDelete(deleteConfig: UserConfig) {
    //this.spinner$.show();
    this.userConfig$.deleteConfig(deleteConfig).subscribe({
      next: (resp: any) => {
        _.remove(this.gridOptions.rowData, (x => x.userId == deleteConfig.userId && x.controlName == deleteConfig.controlName && x.item == deleteConfig.item));
        this.gridOptions.api.setRowData(this.gridOptions.rowData);
      },
      error: e => {
        this.globalEvent$.notification.next(new ToastrInfo('error', 'Failed to delete config!'));
      },
      //complete: () => this.spinner$.hide()
    });
  }

  onSearch() {
    //this.spinner$.show();
    this.userConfig$.searchConfig({
      'globalSearch': this.globalSearch,
      'userid': this.routerParam.userId,
      'screenid': this.routerParam.screenId
    }).subscribe({
      next: (resp: any) => {
        this.gridOptions.rowData = [];
        resp.forEach(element => {
          this.gridOptions.rowData.push(element);
        });
        this.gridOptions.api.setRowData(this.gridOptions.rowData);
      },
      error: e => {
        this.globalEvent$.notification.next(new ToastrInfo('error', 'Failed to load user config'));
      },
      //complete: () => this.spinner$.hide()
    });
  }

  doSearch() {
    this.routerParam.userId = '';
    this.routerParam.screenId = -1;
    this.onSearch();
  }

  onEdit(editConfig?: UserConfig) {
    if (!_.isNull(editConfig) && !_.isUndefined(editConfig)) {
      this.onOpenConfigDialog(editConfig);
    }
  }

  public modalCallback: (response: any) => void = (response) => {
    //Edit action
    if (response.isEditAction) {
      //this.spinner$.show();
      response.data$.editConfig(response.data).subscribe({
        next: (resp: any) => {
          _.remove(this.gridOptions.rowData, (x => x.userId == response.data.userId && x.controlName == response.data.controlName && x.item == response.data.item));
          this.gridOptions.rowData.push(response.data);
          this.gridOptions.api.setRowData(this.gridOptions.rowData);
          this.globalEvent$.notification.next(new ToastrInfo('success', 'succssfully edited config item'));
        },
        error: e => {
          this.globalEvent$.notification.next(new ToastrInfo('error', 'Failed to edit config'));
        },
        //complete: () => this.spinner$.hide()
      });
    }
    //Add action
    else {
      //this.spinner$.show();
      response.data$.addConfig(response.data).subscribe({
        next: (resp: any) => {
          this.gridOptions.rowData.push(resp);
          this.gridOptions.api.setRowData(this.gridOptions.rowData);
          this.globalEvent$.notification.next(new ToastrInfo('success', 'succssfully added config item'));
        },
        error: e => {
          this.globalEvent$.notification.next(new ToastrInfo('error', 'Failed to add config item'));
        },
        //complete: () => this.spinner$.hide()
      });
    }
  }

  private initGrid(): GridOptions {
    return <GridOptions>{
      pagination: true,
      paginationPageSize: 15,
      enableRangeSelection: false,
      defaultColDef: { resizable: true },
      rowData: [],
      columnDefs: [
        { headerName: 'UserID', field: 'userId', sortable: true, filter: 'agTextColumnFilter', minWidth: 50 },
        { headerName: 'Control', field: 'controlName', sortable: true, filter: 'agTextColumnFilter', minWidth: 100 },
        { headerName: 'Item', field: 'item', sortable: true, filter: 'agTextColumnFilter', minWidth: 100 },
        { headerName: 'Value', field: 'dataValue', sortable: true, filter: 'agTextColumnFilter', minWidth: 300 },
        { headerName: 'Updated By', field: 'updatedBy', sortable: true, filter: 'agTextColumnFilter', minWidth: 100 },
        { headerName: 'Host Name', field: 'hostName', sortable: true, filter: 'agTextColumnFilter', minWidth: 100 },
        { headerName: 'Edit', cellRenderer: 'actionBtnRenderer', colId: 'edit', minWidth: 80, cellClass: ['ag-grid-btn-cell'] },
        { headerName: 'Delete', cellRenderer: 'actionBtnRenderer', colId: 'delete', minWidth: 80, cellClass: ['ag-grid-btn-cell'] },
      ],
      onRowDoubleClicked: (event) => {
        this.onOpenConfigDialog(event.data);
      }
    };
  }
}