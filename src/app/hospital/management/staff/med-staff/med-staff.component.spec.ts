import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedStaffComponent } from './med-staff.component';

describe('MedStaffComponent', () => {
  let component: MedStaffComponent;
  let fixture: ComponentFixture<MedStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedStaffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
