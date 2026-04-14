import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTitleComponent } from './form-title.component';

describe('FormHeaderComponent', () => {
  let component: FormTitleComponent;
  let fixture: ComponentFixture<FormTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormTitleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
