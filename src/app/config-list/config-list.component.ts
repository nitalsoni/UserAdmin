import { Component, OnInit } from '@angular/core';
import { UserConfig } from '../models/userConfig';
import { UserConfigService } from '../services/user-config.service';
import { AddConfigModalComponent } from '../add-config-modal/add-config-modal.component'
import { Response, StatusCode } from '../models/Response';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";
import * as _ from "lodash";
import { GlobalVars } from '../services/app.global';
import { SharedService } from '../services/shared.service';
import { Subscription } from 'rxjs';
//import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-config-list',
  templateUrl: './config-list.component.html',
  styleUrls: ['./config-list.component.css']
})

export class UsersComponent implements OnInit {

  openDialogEventsubscription: Subscription;
  searchResult: UserConfig[] = new Array();
  globalSearch: string;
  sUserId: string;
  sScreenName: string;

  options = {
    autoClose: false,
    keepAfterRouteChange: true
  };

  constructor(private userConfigService: UserConfigService, private modalService: NgbModal
    , private spinner: NgxSpinnerService, private globalVar: GlobalVars, private sharedService: SharedService
    , private activatedroute: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    // this.openDialogEventsubscription = this.sharedService.triggerOpenDialogEvent().subscribe(() => {
    //   this.openConfigDialog();
    // });

    this.activatedroute.paramMap.subscribe(params => {
      if (params.keys.length > 0) {
        if (params.get('userid'))
          this.sUserId = params.get('userid');
        if (params.get('screen'))
          this.sScreenName = params.get('screen');

        this.onSearch();
      }
    });
  }

  openConfigDialog(editConfig?: UserConfig) {
    const modalRef = this.modalService.open(AddConfigModalComponent, { centered: true });

    //to check if action is add or edit
    if (_.isNull(editConfig) == null || _.isUndefined(editConfig))
      modalRef.componentInstance.config = new UserConfig();
    else
      modalRef.componentInstance.config = editConfig;

    modalRef.componentInstance.dataService = this.userConfigService;
    modalRef.componentInstance.messageEvent.subscribe(this.modalCallback);
  }

  public modalCallback: (response: any) => void = (response) => {
    //Edit action
    if (response.isEditAction) {
      this.spinner.show();
      response.userConfigService.editConfig(response.data).subscribe({
        next: (resp: any) => {
          _.remove(this.searchResult, (x => x.userId == response.data.userId && x.controlName == response.data.controlName && x.item == response.data.item));
          this.searchResult.push(response.data);
          console.log(`succssfully edited config item ${resp}`);
        },
        error: e => {
          console.log(`failed to edit config ${e}`);
        },
        complete: () => this.spinner.hide()
      });
    }
    //Add action
    else {
      this.spinner.show();
      response.userConfigService.addConfig(response.data).subscribe({
        next: (resp: any) => {
          this.searchResult.push(response.data);
          console.log(`succssfully added config item ${resp}`);
        },
        error: e => {
          console.log(`failed to add user config ${e}`);
        },
        complete: () => this.spinner.hide()
      });
    }
  }

  deleteConfig(deleteConfig: UserConfig) {
    this.spinner.show();
    this.userConfigService.deleteConfig(deleteConfig).subscribe({
      next: (resp: any) => {
        _.remove(this.searchResult, (x => x.userId == deleteConfig.userId && x.controlName == deleteConfig.controlName && x.item == deleteConfig.item));
      },
      error: e => {
        console.log(`failed to delete user config ${e}`);
      },
      complete: () => this.spinner.hide()
    });
  }

  doSearch() {
    this.router.navigate(['config-list', this.globalSearch]);
  }

  onSearch() {
    this.spinner.show();
    this.userConfigService.searchConfig({
      'globalSearch': this.globalSearch,
      'userid': this.sUserId,
      'screen': this.sScreenName
    }).subscribe({
      next: (resp: any) => {
        this.searchResult = [];
        resp.forEach(element => {
          this.searchResult.push(element);
        });
      },
      error: e => {
        console.log(`failed to find user config ${e}`);
      },
      complete: () => this.spinner.hide()
    });
  }
}