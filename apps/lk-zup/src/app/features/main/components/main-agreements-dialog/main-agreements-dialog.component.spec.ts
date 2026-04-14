import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainAgreementsDialogComponent } from './main-agreements-dialog.component';

describe('MainAgreementsDialogComponent', () => {
  let component: MainAgreementsDialogComponent;
  let fixture: ComponentFixture<MainAgreementsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainAgreementsDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainAgreementsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
