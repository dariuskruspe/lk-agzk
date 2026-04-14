import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SupportConfluenceMenuComponent } from './support-confluence-menu.component';

describe('SupportConfluenceMenuComponent', () => {
  let component: SupportConfluenceMenuComponent;
  let fixture: ComponentFixture<SupportConfluenceMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupportConfluenceMenuComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportConfluenceMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
