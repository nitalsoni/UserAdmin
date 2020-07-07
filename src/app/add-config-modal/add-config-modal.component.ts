import { Component, OnInit } from '@angular/core';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-config-modal',
  templateUrl: './add-config-modal.component.html',
  styleUrls: ['./add-config-modal.component.css']
})
export class AddConfigModalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
