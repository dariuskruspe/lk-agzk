import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SurveysManagementTextFormComponent } from './surveys-management-text-form.component';

describe('SurveysManagementTextFormComponent', () => {
  let component: SurveysManagementTextFormComponent;
  let fixture: ComponentFixture<SurveysManagementTextFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SurveysManagementTextFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveysManagementTextFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
