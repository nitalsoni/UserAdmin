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

  private _userConfigService: UserConfigService;
  searchResult: UserConfig[] = new Array();
  searchString: string = 'nsoni5';
  
  constructor(private userConfigService: UserConfigService) {
    this._userConfigService = userConfigService;
  }

  ngOnInit() {
    
  }

  onSearch() {
    this._userConfigService.searchConfig(this.searchString).subscribe((resp: any) => {
      if (resp.statusCode == StatusCode.Ok) {
        this.searchResult = [];
        resp.data.forEach(element => {
          let newUserConfig: UserConfig = { userId: element.userID, controlName: element.name, item: element.type, dataValue: element.item };
          this.searchResult.push(newUserConfig);
          console.log(newUserConfig.userId);
        });
      }
    });
  }
}
