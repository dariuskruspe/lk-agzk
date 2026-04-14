import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrSmartShowModeComponent } from './arr-smart-show-mode.component';

describe('ArrSmartShowModeComponent', () => {
  let component: ArrSmartShowModeComponent;
  let fixture: ComponentFixture<ArrSmartShowModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArrSmartShowModeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrSmartShowModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
