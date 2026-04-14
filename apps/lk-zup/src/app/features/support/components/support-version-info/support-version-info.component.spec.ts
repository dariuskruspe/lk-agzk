import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SupportVersionInfoComponent } from './support-version-info.component';

describe('SupportVersionInfoComponent', () => {
  let component: SupportVersionInfoComponent;
  let fixture: ComponentFixture<SupportVersionInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupportVersionInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportVersionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
