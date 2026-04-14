import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { marked } from 'marked';

@Component({
    selector: 'app-support-version-info',
    templateUrl: './support-version-info.component.html',
    styleUrls: ['./support-version-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SupportVersionInfoComponent implements OnChanges {
  htmlData: string;

  @Input() noteFile;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.noteFile?.currentValue) {
      this.htmlData = marked.parse(this.noteFile, { async: false });
    } else {
      this.htmlData = '';
    }
  }

  // marked.parse('# Marked in Node.js\n\nRendered by **marked**.')
}
