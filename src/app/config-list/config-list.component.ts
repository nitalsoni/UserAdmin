import { Component, OnInit } from '@angular/core';
import { UserConfig } from '../models/userConfig';
import { UserConfigService } from '../services/user-config.service';
import { AddConfigModalComponent } from '../add-config-modal/add-config-modal.component'
import { Response, StatusCode } from '../models/Response';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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
    const modalRef = this.modalService.open(AddConfigModalComponent, { centered: true });
    //modalRef.componentInstance.config = new UserConfig();
    modalRef.componentInstance.config = new UserConfig("nsoni5", "tradeHistory", "th_topic", "tradehistory_prod");

    modalRef.componentInstance.messageEvent.subscribe(data => {
      this.searchResult.push(data);
    });
  }

  onSearch() {
    this._userConfigService.searchConfig(this.searchString).subscribe((resp: any) => {
      if (resp.statusCode == StatusCode.Ok) {
        this.searchResult = [];
        resp.data.forEach(element => {
          let newUserConfig: UserConfig = { userId: element.userID, controlName: element.name, item: element.type, dataValue: element.item };
          this.searchResult.push(newUserConfig);
        });
      }
    });
  }
}
