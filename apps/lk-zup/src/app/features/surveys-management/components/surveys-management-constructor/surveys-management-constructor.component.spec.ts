import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SurveysManagementConstructorComponent } from './surveys-management-constructor.component';

describe('SurveysManagementConstructorComponent', () => {
  let component: SurveysManagementConstructorComponent;
  let fixture: ComponentFixture<SurveysManagementConstructorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SurveysManagementConstructorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveysManagementConstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
