import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IssuesManagementApproveComponent } from './issues-management-approve.component';

describe('IssuesManagementApproveComponent', () => {
  let component: IssuesManagementApproveComponent;
  let fixture: ComponentFixture<IssuesManagementApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IssuesManagementApproveComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuesManagementApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
