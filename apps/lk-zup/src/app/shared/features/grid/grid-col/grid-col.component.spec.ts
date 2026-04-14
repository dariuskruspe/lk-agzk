import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GridColComponent } from './grid-col.component';

describe('GridColComponent', () => {
  let component: GridColComponent;
  let fixture: ComponentFixture<GridColComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridColComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GridColComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose sticky-left styles on the host', () => {
    fixture.componentRef.setInput('sticky', 'left');
    fixture.detectChanges();

    const hostElement: HTMLElement = fixture.nativeElement;

    expect(hostElement.classList.contains('app-grid-col-host--sticky-left'))
      .toBe(true);
    expect(hostElement.style.position).toBe('sticky');
    expect(hostElement.style.left).toBe('0px');
    expect(hostElement.style.right).toBe('');
  });

  it('should expose sticky-right styles on the host', () => {
    fixture.componentRef.setInput('sticky', 'right');
    fixture.detectChanges();

    const hostElement: HTMLElement = fixture.nativeElement;

    expect(hostElement.classList.contains('app-grid-col-host--sticky-right'))
      .toBe(true);
    expect(hostElement.style.position).toBe('sticky');
    expect(hostElement.style.left).toBe('');
    expect(hostElement.style.right).toBe('0px');
  });

  it('should not apply sticky styles when sticky is omitted', () => {
    const hostElement: HTMLElement = fixture.nativeElement;

    expect(hostElement.classList.contains('app-grid-col-host--sticky-left'))
      .toBe(false);
    expect(hostElement.classList.contains('app-grid-col-host--sticky-right'))
      .toBe(false);
    expect(hostElement.style.position).toBe('');
    expect(hostElement.style.left).toBe('');
    expect(hostElement.style.right).toBe('');
  });
});
