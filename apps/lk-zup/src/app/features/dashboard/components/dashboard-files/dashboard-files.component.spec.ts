import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardFilesComponent } from './dashboard-files.component';

describe('DashboardFilesComponent', () => {
  let component: DashboardFilesComponent;
  let fixture: ComponentFixture<DashboardFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardFilesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
