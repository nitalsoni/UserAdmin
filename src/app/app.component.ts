import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";
import { SpinnerService } from './services/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'playground-app';

  constructor(private modalService: NgbModal, private ngxSpinner$: NgxSpinnerService, private spinner$: SpinnerService) {
    this.spinner$.action.subscribe(x  => {
      if (x.toUpperCase() == 'SHOW') {
        this.ngxSpinner$.show();
      }
      else if (x.toUpperCase() == 'HIDE') {
        this.ngxSpinner$.hide();
      }
    });
  }
}
