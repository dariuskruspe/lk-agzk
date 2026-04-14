import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { GroupedListByComponent } from './components/grouped-list-by/grouped-list-by.component';
import { GroupedListHeaderComponent } from './components/grouped-list-header/grouped-list-header.component';
import { GroupedListComponent } from './components/grouped-list/grouped-list.component';

@NgModule({
  declarations: [
    GroupedListComponent,
    GroupedListByComponent,
    GroupedListHeaderComponent,
  ],
  exports: [
    GroupedListComponent,
    GroupedListByComponent,
    GroupedListHeaderComponent,
  ],
  imports: [CommonModule, SharedModule],
})
export class GroupedListModule {}
