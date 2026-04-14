import { Routes } from '@angular/router';
import { CustomSectionsListComponent } from './custom-sections-list/custom-sections-list.component';
import { CustomSectionsEditComponent } from './custom-sections-edit/custom-sections-edit.component';

export default [
  {
    path: '',
    component: CustomSectionsListComponent,
  },
  {
    path: 'edit/:id',
    component: CustomSectionsEditComponent,
  },
] as Routes;
