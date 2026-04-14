import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-my-team-widgets',
    imports: [],
    template: `<p>my-team-widgets works!</p>`,
    styleUrl: './my-team-widgets.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyTeamWidgetsComponent { }
