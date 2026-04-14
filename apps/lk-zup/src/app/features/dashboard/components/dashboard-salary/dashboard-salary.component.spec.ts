import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardSalaryComponent } from './dashboard-salary.component';

describe('DashboardSalaryComponent', () => {
  let component: DashboardSalaryComponent;
  let fixture: ComponentFixture<DashboardSalaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardSalaryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
