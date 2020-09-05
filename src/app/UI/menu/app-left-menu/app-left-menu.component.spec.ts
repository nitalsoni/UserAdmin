import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppLeftMenuComponent } from './app-left-menu.component';

describe('AppLeftMenuComponent', () => {
  let component: AppLeftMenuComponent;
  let fixture: ComponentFixture<AppLeftMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppLeftMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppLeftMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
