import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DashboardIssueComponent } from './dashboard-issue.component';

describe('DashboardComponent', () => {
  let component: DashboardIssueComponent;
  let fixture: ComponentFixture<DashboardIssueComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardIssueComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
