import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SectorInfo } from '../models/sectorInfo';
import { UserInfoService } from '../services/user-info.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import * as _ from "lodash";

@Component({
  selector: 'app-add-sector',
  templateUrl: './add-sector.component.html',
  styleUrls: ['./add-sector.component.css']
})
export class AddSectorComponent implements OnInit {

  @Input() public dataService: UserInfoService;
  @Output() messageEvent = new EventEmitter<any>();

  private sectorForm: FormGroup;
  constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.sectorForm = this.formBuilder.group({
      sector: ['', [Validators.required]],
      subSector: ['', [Validators.required]],
      account: ['']
    });
  }

  get f() { return this.sectorForm.controls; }

  save() {
    let newSector: SectorInfo = new SectorInfo(this.sectorForm.value);
    let response = { 'data': newSector, 'service': this.dataService };
    this.messageEvent.emit(response);
    this.activeModal.close();
  }

}
