import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-my-team-full',
    imports: [],
    template: `<p>my-team-full works!</p>`,
    styleUrl: './my-team-full.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyTeamFullComponent { }
