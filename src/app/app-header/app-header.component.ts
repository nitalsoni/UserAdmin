import { Component, OnInit } from '@angular/core';
import { GlobalVars } from '../services/app.global';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent implements OnInit {

  constructor(private globalVar: GlobalVars) { }

  ngOnInit() {
  }

}
