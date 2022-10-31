import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedLabComponent } from './med-lab.component';

describe('MedLabComponent', () => {
  let component: MedLabComponent;
  let fixture: ComponentFixture<MedLabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedLabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
