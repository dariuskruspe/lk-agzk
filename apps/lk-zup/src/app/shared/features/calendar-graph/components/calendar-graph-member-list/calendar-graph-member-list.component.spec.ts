import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarGraphMemberListComponent } from './calendar-graph-member-list.component';

describe('CalendarGraphMemberListComponent', () => {
  let component: CalendarGraphMemberListComponent;
  let fixture: ComponentFixture<CalendarGraphMemberListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalendarGraphMemberListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarGraphMemberListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
