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

  onButtonGroupClick($event){
    let clickedElement = $event.target || $event.srcElement;
    if( clickedElement.nodeName === "BUTTON" ) {
  debugger;
      let isCertainButtonAlreadyActive = clickedElement.parentElement.querySelector(".active");
      // if a Button already has Class: .active
      if( isCertainButtonAlreadyActive ) {
        isCertainButtonAlreadyActive.classList.remove("active");
      }
  
      clickedElement.classList.add("active");
      //clickedElement.className += " active";
    }
  
  }

}
