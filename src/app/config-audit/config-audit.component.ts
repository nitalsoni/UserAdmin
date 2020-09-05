import { Component, OnInit } from '@angular/core';
import { NgxTypeaheadModule } from "ngx-typeahead";

@Component({
  selector: 'app-config-audit',
  templateUrl: './config-audit.component.html',
  styleUrls: ['./config-audit.component.css']
})
export class ConfigAuditComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  public url = 'http://localhost:65413/api/user';
  public api = 'http';
  public params = {};
  public query = '';
  public debounce = 3000;

  public handleResultSelected (result) {
    this.query = result;
  }
}
