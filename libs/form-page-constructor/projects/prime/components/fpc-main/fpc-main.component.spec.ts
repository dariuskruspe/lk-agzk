import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FpcPrimeComponent } from './fpc-main.component';

describe('NgfpcMainComponent', () => {
  let component: FpcPrimeComponent;
  let fixture: ComponentFixture<FpcPrimeComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FpcPrimeComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FpcPrimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
