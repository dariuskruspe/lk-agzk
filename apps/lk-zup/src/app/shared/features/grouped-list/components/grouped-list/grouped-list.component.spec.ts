import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupedListComponent } from './grouped-list.component';

describe('GroupedListComponent', () => {
  let component: GroupedListComponent;
  let fixture: ComponentFixture<GroupedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupedListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
