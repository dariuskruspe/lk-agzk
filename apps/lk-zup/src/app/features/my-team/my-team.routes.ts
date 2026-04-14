import { Routes } from '@angular/router';
import { MyTeamComponent } from '@features/my-team/my-team/my-team.component';
import { MyTeamWidgetsComponent } from './my-team-widgets/my-team-widgets.component';
import { MyTeamFullComponent } from './my-team-full/my-team-full.component';

export default [
  {
    path: '',
    component: MyTeamComponent,
    children: [
      {
        path: 'full',
        data: { fullContent: true },
        component: MyTeamFullComponent,
      },

      {
        path: 'widgets',
        component: MyTeamWidgetsComponent,
      },
    ],
  },
] as Routes;
