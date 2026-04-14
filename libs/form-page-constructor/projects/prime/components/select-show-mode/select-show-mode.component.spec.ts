import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectShowModeComponent } from './select-show-mode.component';

describe('SelectShowModeComponent', () => {
  let component: SelectShowModeComponent;
  let fixture: ComponentFixture<SelectShowModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectShowModeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectShowModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
