import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionBtnRendererComponent } from './action-btn-renderer.component';

describe('ActionBtnRendererComponent', () => {
  let component: ActionBtnRendererComponent;
  let fixture: ComponentFixture<ActionBtnRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionBtnRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionBtnRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
