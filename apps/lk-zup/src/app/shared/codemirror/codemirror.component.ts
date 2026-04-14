import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  model,
  output,
  ViewChild,
} from '@angular/core';
import { basicSetup } from 'codemirror';
import { linter, lintGutter } from '@codemirror/lint';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { json, jsonParseLinter } from '@codemirror/lang-json';
import { javascript } from '@codemirror/lang-javascript';
import { githubLight } from './themes/github-light';
@Component({
    selector: 'app-codemirror',
    imports: [],
    templateUrl: './codemirror.component.html',
    styleUrl: './codemirror.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodemirrorComponent {
  value = model<string>('');

  @ViewChild('wrapper') wrapper!: ElementRef;

  view!: EditorView;

  afterInited = false;

  constructor() {}

  ngAfterViewInit() {
    let state = EditorState.create({
      doc: this.value(),
      extensions: [
        githubLight,
        basicSetup,
        keymap.of(defaultKeymap),
        json(),
        lintGutter(),
        linter(jsonParseLinter()),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const newValue = update.state.doc.toString();
            this.value.set(newValue);
          }
        }),
      ],
    });

    this.view = new EditorView({
      state: state,
      parent: this.wrapper.nativeElement,
    });
  }

  ngOnDestroy() {
    this.view.destroy();
  }
}
