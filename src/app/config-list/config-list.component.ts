import { Component, OnInit } from '@angular/core';
import { UserConfig } from '../models/userConfig';
import { UserConfigService } from '../services/user-config.service';
import { AddConfigModalComponent } from '../add-config-modal/add-config-modal.component'
import { Response, StatusCode } from '../models/Response';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";
import * as _ from "lodash";

@Component({
  selector: 'app-config-list',
  templateUrl: './config-list.component.html',
  styleUrls: ['./config-list.component.css']
})

export class UsersComponent implements OnInit {

  private _userConfigService: UserConfigService;
  searchResult: UserConfig[] = new Array();
  searchString: string = 'nsoni5';

  constructor(private userConfigService: UserConfigService, private modalService: NgbModal,
    private spinner: NgxSpinnerService) {
    this._userConfigService = userConfigService;
  }

  ngOnInit() {
  }

  openConfigDialog(editConfig?: UserConfig) {
    const modalRef = this.modalService.open(AddConfigModalComponent, { centered: true });

    //to check if action is add or edit
    if (_.isNull(editConfig) == null || _.isUndefined(editConfig))
      modalRef.componentInstance.config = new UserConfig();
    else
      modalRef.componentInstance.config = editConfig;

    modalRef.componentInstance.dataService = this._userConfigService;
    modalRef.componentInstance.messageEvent.subscribe(this.modalCallback);
  }

  public modalCallback: (response: any) => void = (response) => {
    //Edit action
    if (response.isEditAction) {
      this.spinner.show();
      response.userConfigService.editConfig(response.data).subscribe({
        next: (resp: any) => {
          if (resp.statusCode == StatusCode.Ok) {
            _.remove(this.searchResult, (x => x.userId == response.data.userId && x.controlName == response.data.controlName && x.item == response.data.item));
            this.searchResult.push(response.data);
            console.log(`succssfully edited config item ${resp.data}`);
          }
          else {
            console.log(`failed to edited config item ${resp.message}`);
          }
        },
        error: e => console.error('There was an error!', e),
        complete: () => this.spinner.hide()
      });
    }
    //Add action
    else {
      this.spinner.show();
      response.userConfigService.addConfig(response.data).subscribe({
        next: (resp: any) => {
          if (resp.statusCode == StatusCode.Ok) {
            this.searchResult.push(response.data);
            console.log(`succssfully added config item ${resp.data}`);
          }
          else {
            console.log(`failed to add config item ${resp.message}`);
          }
        },
        error: e => console.error('There was an error!', e),
        complete: () => this.spinner.hide()
      });
    }
  }

  deleteConfig(deleteConfig: UserConfig) {
    this.spinner.show();
    this._userConfigService.deleteConfig(deleteConfig).subscribe({
      next: (resp: any) => {
        if (resp.statusCode == StatusCode.Ok) {
          _.remove(this.searchResult, (x => x.userId == deleteConfig.userId && x.controlName == deleteConfig.controlName && x.item == deleteConfig.item));
        }
        else {
          console.log(`failed to delete config item ${resp.message}`);
        }
      },
      error: e => console.error('There was an error!', e),
      complete: () => this.spinner.hide()
    });
  }

  onSearch() {
    this.spinner.show();
    this._userConfigService.searchConfig(this.searchString).subscribe({
      next: (resp: any) => {
        if (resp.statusCode == StatusCode.Ok) {
          this.searchResult = [];
          resp.data.forEach(element => {
            this.searchResult.push(element);
          });
        }
      },
      error: e => console.error('There was an error!', e),
      complete: () => this.spinner.hide()
    });
  }
}
