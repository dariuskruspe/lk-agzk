import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarGraphMobileIntersectionComponent } from './calendar-graph-mobile-intersection.component';

describe('CalendarGraphMobileIntersectionComponent', () => {
  let component: CalendarGraphMobileIntersectionComponent;
  let fixture: ComponentFixture<CalendarGraphMobileIntersectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalendarGraphMobileIntersectionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarGraphMobileIntersectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
