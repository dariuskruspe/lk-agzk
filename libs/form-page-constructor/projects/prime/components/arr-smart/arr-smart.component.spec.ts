import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrSmartComponent } from './arr-smart.component';

describe('ArrSmartComponent', () => {
  let component: ArrSmartComponent;
  let fixture: ComponentFixture<ArrSmartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArrSmartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrSmartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
