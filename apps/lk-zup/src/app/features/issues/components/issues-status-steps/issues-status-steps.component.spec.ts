import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IssuesStatusStepsComponent } from './issues-status-steps.component';

describe('IssuesStatusStepsComponent', () => {
  let component: IssuesStatusStepsComponent;
  let fixture: ComponentFixture<IssuesStatusStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IssuesStatusStepsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuesStatusStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
