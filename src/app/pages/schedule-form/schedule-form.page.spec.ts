import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduleFormPage } from './schedule-form.page';

describe('ScheduleFormPage', () => {
  let component: ScheduleFormPage;
  let fixture: ComponentFixture<ScheduleFormPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ScheduleFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
