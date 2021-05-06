import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RutePlannerComponent } from './rute-planner.component';

describe('RutePlannerComponent', () => {
  let component: RutePlannerComponent;
  let fixture: ComponentFixture<RutePlannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RutePlannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RutePlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
