import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserConfig } from '../models/userConfig';
import * as _ from "lodash";

@Component({
  selector: 'app-add-config-modal',
  templateUrl: './add-config-modal.component.html',
  styleUrls: ['./add-config-modal.component.css']
})
export class AddConfigModalComponent implements OnInit {

  private userConfig: UserConfig;
  private isEditAction: boolean;

  constructor(public activeModal: NgbActiveModal) { }

  @Input() public config: UserConfig;
  @Output() messageEvent = new EventEmitter<UserConfig>();

  ngOnInit() {
    this.userConfig = this.config;
    this.isEditAction = _.isEmpty(this.userConfig.userId) ? false : true;
  }

  saveConfig() {
    this.messageEvent.emit(this.userConfig);
    this.activeModal.close();
  }

}
