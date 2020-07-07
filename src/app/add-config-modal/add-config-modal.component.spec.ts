import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConfigModalComponent } from './add-config-modal.component';

describe('AddConfigModalComponent', () => {
  let component: AddConfigModalComponent;
  let fixture: ComponentFixture<AddConfigModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddConfigModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddConfigModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
