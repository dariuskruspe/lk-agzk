import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamFullComponent } from './team-full.component';

describe('TeamFullComponent', () => {
  let component: TeamFullComponent;
  let fixture: ComponentFixture<TeamFullComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamFullComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
