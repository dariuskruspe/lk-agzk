import { Routes } from '@angular/router';
import { AdminIssueTemplateEditComponent } from './issue-template-edit/issue-template-edit.component';
import { AdminIssueTemplateListComponent } from './issue-template-list/issue-template-list.component';

export default [
  {
    path: '',
    component: AdminIssueTemplateListComponent,
  },
  {
    path: ':issueTemplateId',
    component: AdminIssueTemplateEditComponent,
  },
] as Routes;
