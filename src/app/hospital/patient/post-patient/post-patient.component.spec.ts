import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostPatientComponent } from './post-patient.component';

describe('PostPatientComponent', () => {
  let component: PostPatientComponent;
  let fixture: ComponentFixture<PostPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostPatientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
