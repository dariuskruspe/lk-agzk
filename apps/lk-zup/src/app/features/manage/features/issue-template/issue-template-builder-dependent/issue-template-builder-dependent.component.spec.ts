import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IssueTemplateBuilderDependentComponent } from './issue-template-builder-dependent.component';

describe('VisualConstructorBaseFormComponent', () => {
  let component: IssueTemplateBuilderDependentComponent;
  let fixture: ComponentFixture<IssueTemplateBuilderDependentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssueTemplateBuilderDependentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IssueTemplateBuilderDependentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
