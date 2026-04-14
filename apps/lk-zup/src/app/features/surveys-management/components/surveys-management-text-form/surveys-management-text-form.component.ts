import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';

@Component({
    selector: 'app-surveys-management-text-form',
    templateUrl: './surveys-management-text-form.component.html',
    styleUrls: ['./surveys-management-text-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SurveysManagementTextFormComponent {
  @Input() text: string;
}
