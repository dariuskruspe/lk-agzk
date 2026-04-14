import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupedListHeaderComponent } from './grouped-list-header.component';

describe('GroupedListHeaderComponent', () => {
  let component: GroupedListHeaderComponent;
  let fixture: ComponentFixture<GroupedListHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupedListHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupedListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
