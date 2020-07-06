import { Component, OnInit } from '@angular/core';
import { UserConfig } from '../models/userConfig';
import { UserConfigService } from '../services/user-config.service';
import { Response, StatusCode } from '../models/Response';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  searchResult: UserConfig[] = new Array();
  private _userConfigService: UserConfigService;
  
  constructor(private userConfigService: UserConfigService) {
    this._userConfigService = userConfigService;
  }

  ngOnInit() {
    this._userConfigService.searchConfig("nsoni5").subscribe((resp: any) => {
      if (resp.statusCode == StatusCode.Ok) {
        resp.data.forEach(element => {
          let newUserConfig: UserConfig = { userId: element.userID, controlName: element.name, item: element.type, dataValue: element.item };
          this.searchResult.push(newUserConfig);
          console.log(newUserConfig.userId);
        });
      }
    });
  }
}
