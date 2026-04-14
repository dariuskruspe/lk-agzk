import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LangModule } from '../../features/lang/lang.module';
import { IssueStatusComponent } from './issue-status.component';

@NgModule({
  imports: [CommonModule, LangModule],
  declarations: [IssueStatusComponent],
  exports: [IssueStatusComponent],
})
export class StatusModule {}
