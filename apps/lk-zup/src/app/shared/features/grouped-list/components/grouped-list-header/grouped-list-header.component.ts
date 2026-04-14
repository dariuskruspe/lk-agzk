import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-grouped-list-header',
    templateUrl: './grouped-list-header.component.html',
    styleUrls: ['./grouped-list-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class GroupedListHeaderComponent {}
