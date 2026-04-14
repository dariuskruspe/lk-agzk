import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
    selector: 'app-issues-management-approve',
    templateUrl: './issues-management-approve.component.html',
    styleUrls: ['./issues-management-approve.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class IssuesManagementApproveComponent {
  @Input() isRequiringApproval: boolean;

  @Input() isRequiringSignature: boolean;

  @Input() loading: boolean;

  @Input() isItDialog: boolean;

  @Output() approved = new EventEmitter<void>();

  @Output() rejected = new EventEmitter<void>();

  @Output() closeDialog = new EventEmitter<void>();
}
