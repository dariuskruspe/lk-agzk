import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardPopularRequestsComponent } from './dashboard-popular-requests.component';

describe('DashboardPopularRequestsComponent', () => {
  let component: DashboardPopularRequestsComponent;
  let fixture: ComponentFixture<DashboardPopularRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardPopularRequestsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardPopularRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
