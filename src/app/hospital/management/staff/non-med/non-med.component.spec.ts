import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonMedComponent } from './non-med.component';

describe('NonMedComponent', () => {
  let component: NonMedComponent;
  let fixture: ComponentFixture<NonMedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonMedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonMedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
