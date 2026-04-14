import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MainWelcomeComponent } from './main-welcome.component';

describe('MainWelcomeComponent', () => {
  let component: MainWelcomeComponent;
  let fixture: ComponentFixture<MainWelcomeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MainWelcomeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
