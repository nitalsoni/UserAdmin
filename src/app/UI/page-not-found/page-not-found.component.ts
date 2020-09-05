import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const visual = document.getElementById("visual")
    const events = ['resize', 'load']

    events.forEach(function (e) {
      window.addEventListener(e, function () {
        const width = window.innerWidth
        const height = window.innerHeight
        const ratio = 45 / (width / height)
        visual.style.transform = "translate(-50%, -50%) rotate(-" + ratio + "deg)"
      });
    });
  }

}
