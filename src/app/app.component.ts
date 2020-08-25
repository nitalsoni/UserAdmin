import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";
import { GlobalEventService } from './services/global-event.service';
import { ToastrService } from 'ngx-toastr';
import { ToastrInfo } from './models/ToastrInfo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'playground-app';

  constructor(private modalService: NgbModal, private ngxSpinner$: NgxSpinnerService
    , private globalEvent$: GlobalEventService, private toastr: ToastrService) {

  }

  ngOnInit() {
    this.globalEvent$.spinner.subscribe(x => {
      if (x.toUpperCase() == 'SHOW') {
        this.ngxSpinner$.show();
      }
      else if (x.toUpperCase() == 'HIDE') {
        this.ngxSpinner$.hide();
      }
    });

    this.globalEvent$.notification.subscribe(x => {
        let toastrInfo = (x as ToastrInfo);
        switch(toastrInfo.type.toUpperCase())
        {
          case 'INFO':
            this.toastr.info(toastrInfo.message, toastrInfo.title);
            break;
          case 'SUCCESS':
            this.toastr.success(toastrInfo.message, toastrInfo.title);
            break;
          case 'ERROR':
            this.toastr.error(toastrInfo.message, toastrInfo.title);
            break;
          case 'WARNING':
            this.toastr.warning(toastrInfo.message, toastrInfo.title);
            break;
        }
    });
  }
}
