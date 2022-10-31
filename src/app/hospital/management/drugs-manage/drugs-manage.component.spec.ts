import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugsManageComponent } from './drugs-manage.component';

describe('DrugsManageComponent', () => {
  let component: DrugsManageComponent;
  let fixture: ComponentFixture<DrugsManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrugsManageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugsManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
