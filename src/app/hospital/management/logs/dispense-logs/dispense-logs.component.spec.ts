import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispenseLogsComponent } from './dispense-logs.component';

describe('DispenseLogsComponent', () => {
  let component: DispenseLogsComponent;
  let fixture: ComponentFixture<DispenseLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispenseLogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DispenseLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
