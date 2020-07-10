import { Component, OnInit } from '@angular/core';
import { UserConfig } from '../models/userConfig';
import { UserConfigService } from '../services/user-config.service';
import { AddConfigModalComponent } from '../add-config-modal/add-config-modal.component'
import { Response, StatusCode } from '../models/Response';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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

  constructor(private userConfigService: UserConfigService, private modalService: NgbModal) {
    this._userConfigService = userConfigService;
  }

  ngOnInit() {

  }

  openConfigDialog(editConfig?: UserConfig) {
    console.log(editConfig);

    const modalRef = this.modalService.open(AddConfigModalComponent, { centered: true });
    if (_.isNull(editConfig) == null || _.isUndefined(editConfig))
      modalRef.componentInstance.config = new UserConfig();
    else
      modalRef.componentInstance.config = editConfig;

    modalRef.componentInstance.messageEvent.subscribe(response => {
      if (response.isEditAction) {
        let result = _.remove(this.searchResult, (x =>
          x.userId == response.data.userId
          && x.controlName == response.data.controlName
          && x.item == response.data.item
        ));
      }
      this.searchResult.push(response.data);

      this._userConfigService.addConfig(editConfig).subscribe((resp: any) => {
        if (resp.statusCode == StatusCode.Ok) {
          console.log(`add config response ${resp.data}`) ;
        }
      });
    });
  }

  deleteConfig(deleteConfig: UserConfig) {
    _.remove(this.searchResult, (x =>
      x.userId == deleteConfig.userId
      && x.controlName == deleteConfig.controlName
      && x.item == deleteConfig.item));
  }

  onSearch() {
    this._userConfigService.searchConfig(this.searchString).subscribe((resp: any) => {
      if (resp.statusCode == StatusCode.Ok) {
        this.searchResult = [];
        resp.data.forEach(element => {
          //let newUserConfig: UserConfig = { userId: element.userID, controlName: element.name, item: element.type, dataValue: element.item };
          this.searchResult.push(element);
        });
      }
    });
  }
}
