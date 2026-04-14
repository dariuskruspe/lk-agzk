import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { TrustedHtmlModule } from '../../../pipes/security/trusted-html.module';

@Component({
    selector: 'app-custom-sections-template-view',
    imports: [TrustedHtmlModule],
    templateUrl: './custom-sections-template-view.component.html',
    styleUrl: './custom-sections-template-view.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class CustomSectionsTemplateViewComponent {
  template = input.required<string>();

  html = computed(() => {
    return this.template();
  });
}
