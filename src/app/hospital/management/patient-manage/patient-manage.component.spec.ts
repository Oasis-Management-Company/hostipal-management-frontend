import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientManageComponent } from './patient-manage.component';

describe('PatientManageComponent', () => {
  let component: PatientManageComponent;
  let fixture: ComponentFixture<PatientManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientManageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
