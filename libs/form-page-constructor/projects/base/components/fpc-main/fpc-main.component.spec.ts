import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FpcMainComponent } from './fpc-main.component';

describe('NgfpcMainComponent', () => {
  let component: FpcMainComponent;
  let fixture: ComponentFixture<FpcMainComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FpcMainComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FpcMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
