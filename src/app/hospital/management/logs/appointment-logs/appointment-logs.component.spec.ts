import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentLogsComponent } from './appointment-logs.component';

describe('AppointmentLogsComponent', () => {
  let component: AppointmentLogsComponent;
  let fixture: ComponentFixture<AppointmentLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentLogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
