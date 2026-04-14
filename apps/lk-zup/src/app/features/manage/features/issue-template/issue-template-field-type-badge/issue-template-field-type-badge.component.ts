import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FIELD_TYPE_NAMES } from '@root/libs/form-page-constructor/projects/base/dictionaries/field-type-names.enum';

@Component({
    selector: 'app-issue-template-field-type-badge',
    imports: [],
    templateUrl: './issue-template-field-type-badge.component.html',
    styleUrl: './issue-template-field-type-badge.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssueTemplateFieldTypeBadgeComponent {
  type = input.required<string>();
  name = computed(() => FIELD_TYPE_NAMES[this.type()]);
}
