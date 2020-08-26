import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserConfig } from '../models/userConfig';
import { UserConfigService } from '../services/user-config.service';
import { ScreenConfigItemService } from '../services/screen-config-item.service'
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import * as _ from "lodash";
import { GlobalEventService } from '../services/global-event.service';
import { ToastrInfo } from '../models/ToastrInfo';

@Component({
  selector: 'app-add-config-modal',
  templateUrl: './add-config-modal.component.html',
  styleUrls: ['./add-config-modal.component.css']
})
export class AddConfigModalComponent implements OnInit {

  private userConfig: UserConfig;
  private isEditAction: boolean;
  private configForm: FormGroup;
  public controlNameList: Array<string>;

  constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder,
    private screenConfigItem$: ScreenConfigItemService, private globalEvent$: GlobalEventService) { }

  @Input() public config: UserConfig;
  @Input() public dataService: UserConfigService;
  @Output() messageEvent = new EventEmitter<any>();

  ngOnInit() {
    this.userConfig = this.config;
    this.isEditAction = _.isEmpty(this.userConfig.userId) ? false : true;
    this.initForm(this.config);
  }

  initForm(configEntry: UserConfig) {
    if (!this.controlNameList || this.controlNameList.length == 0) {
      this.screenConfigItem$.getAllControlNames().subscribe({
        next: (resp: any) => {
          this.controlNameList = resp;
        },
        error: e => {
          this.globalEvent$.notification.next(new ToastrInfo('error', 'Failed to load control names'));
        }
      });
    }

    this.configForm = this.formBuilder.group({
      userId: [configEntry.userId, [Validators.required, Validators.minLength(3)]],
      controlName: [configEntry.controlName, [Validators.required]],
      item: [configEntry.item, [Validators.required, Validators.minLength(5)]],
      dataValue: [configEntry.dataValue, [Validators.required, Validators.minLength(5)]]
    });
  }

  get f() { return this.configForm.controls; }

  saveConfig() {

    this.userConfig = new UserConfig(this.configForm.value);
    let response = { 'isEditAction': this.isEditAction, 'data': this.userConfig, 'data$': this.dataService };
    this.messageEvent.emit(response);
    this.activeModal.close();
  }

}
