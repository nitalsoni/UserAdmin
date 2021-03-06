import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { NewUser } from '../../models/NewUser';
import { Response, StatusCode } from '../../models/Response';
import { GlobalEventService } from '../../services/global-event.service';
import { ToastrInfo } from '../../models/ToastrInfo';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  @Input() public dataService: UserService;
  @Output() messageEvent = new EventEmitter<any>();

  private newUserForm: FormGroup;
  private userList: Array<string>;
  private selectedCloneUser: string;
  constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder
    , private userService: UserService, private globalEvent$: GlobalEventService) {

  }

  ngOnInit() {
    this.initForm();
    this.getAllUsers();
  }

  initForm() {
    this.newUserForm = this.formBuilder.group({
      userId: ['', [Validators.required]],
      cloneUserId: [''],
      copySector: [false],
    });
  }

  onChange(e) {
    this.newUserForm.get('cloneUserId').setValue(e.target.value, { onlySelf: true });
  }

  getAllUsers() {
    this.userService.getAllUserId().subscribe({
      next: (resp: any) => {
        this.userList = resp;
        console.log(`succssfully fetched all UserIds ${resp}`);
      },
      error: e => {
        this.globalEvent$.notification.next(new ToastrInfo('error', 'Failed to load UserId list'));
      }
    });
  }

  save() {
    let newUser: NewUser = new NewUser(this.newUserForm.value);
    let response = { 'data': newUser, 'service': this.dataService };
    this.messageEvent.emit(response);
    this.activeModal.close();
  }

  get f() { return this.newUserForm.controls; }

}
