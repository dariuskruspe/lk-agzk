import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IssuesStatusItemInterface } from '../../models/issues-status-item.interface';

@Component({
    selector: 'app-issues-status-steps',
    templateUrl: './issues-status-steps.component.html',
    styleUrls: ['./issues-status-steps.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class IssuesStatusStepsComponent {
  @Input() steps: IssuesStatusItemInterface[];

  isActiveStep(item: IssuesStatusItemInterface): boolean {
    if (this.steps && this.steps.length) {
      const activeIndex = this.steps.findIndex((step) => step.active);
      const currentIndex = this.steps.findIndex((step) => step.id === item.id);
      return currentIndex <= activeIndex;
    } else {
      return false;
    }
  }

  isActiveDivider(item: IssuesStatusItemInterface): boolean {
    if (this.steps && this.steps.length) {
      const activeIndex = this.steps.findIndex((step) => step.active);
      const currentIndex = this.steps.findIndex((step) => step.id === item.id);
      return currentIndex < activeIndex;
    } else {
      return false;
    }
  }
}
