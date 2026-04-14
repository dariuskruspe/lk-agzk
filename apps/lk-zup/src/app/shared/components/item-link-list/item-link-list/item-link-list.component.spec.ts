import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemLinkListComponent } from './item-link-list.component';

describe('ItemLinkListComponent', () => {
  let component: ItemLinkListComponent;
  let fixture: ComponentFixture<ItemLinkListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemLinkListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemLinkListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
