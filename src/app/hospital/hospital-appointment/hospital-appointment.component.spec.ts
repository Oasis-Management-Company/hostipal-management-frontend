import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalAppointmentComponent } from './hospital-appointment.component';

describe('HospitalAppointmentComponent', () => {
  let component: HospitalAppointmentComponent;
  let fixture: ComponentFixture<HospitalAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalAppointmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
