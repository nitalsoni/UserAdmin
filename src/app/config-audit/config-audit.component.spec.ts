import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigAuditComponent } from './config-audit.component';

describe('ConfigAuditComponent', () => {
  let component: ConfigAuditComponent;
  let fixture: ComponentFixture<ConfigAuditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
