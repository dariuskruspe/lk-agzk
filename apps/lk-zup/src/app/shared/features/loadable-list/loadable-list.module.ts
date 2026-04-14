import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ItemListBuilderModule } from '../../components/item-list-builder/item-list-builder.module';
import { TakeModule } from '../../pipes/take.module';
import { FilterModule } from '../fpc-filter/filter.module';
import { FpcModule } from '../fpc/fpc.module';
import { LangModule } from '../lang/lang.module';
import { LoadableListComponent } from './components/loadable-list/loadable-list.component';
import { LoadableListContainerComponent } from './containers/loadable-list-container/loadable-list-container.component';
import { LoadableListDirective } from './directives/loadable-list.directive';
import { InfoComponent } from '../../components/info/info.component';

@NgModule({
  declarations: [
    LoadableListContainerComponent,
    LoadableListComponent,
    LoadableListDirective,
  ],
  imports: [
    CommonModule,
    FpcModule,
    LangModule,
    ItemListBuilderModule,
    PaginatorModule,
    ProgressSpinnerModule,
    CheckboxModule,
    ButtonModule,
    FilterModule,
    TakeModule,
    InfoComponent,
  ],
  providers: [],
  exports: [
    LoadableListContainerComponent,
    LoadableListComponent,
    LoadableListDirective,
  ],
})
export class LoadableListModule {}
