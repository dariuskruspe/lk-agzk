import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Inject,
  input,
  Optional,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { StaticFilesInterface } from '../../../models/fpc.interface';
import { getFileIcon } from '../../../utils/file-icon.util';

@Component({
    template: '',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class FpcBaseFilesComponent {
  files = input<StaticFilesInterface[]>();
  loading = input<boolean>();
  openFile = output<string>();

  items = computed(() => {
    return this.files().map((item) => ({
      ...item,
      icon: this.getIconPath(item.fileName),
    }));
  });

  constructor(
    @Inject('apiToken') @Optional() public readonly apiUrl: string,
    @Inject('fileIconsPath') @Optional() public readonly iconPath: string,
  ) {}

  onOpenFile(file: StaticFilesInterface): void {
    this.openFile.emit(
      file['reqScript']
        ? ({
            fileID: file['fileID'],
            reqScript: file['reqScript'],
          } as any)
        : file.fileID,
    );
  }

  private getIconPath(name: string): string {
    return getFileIcon(name, this.iconPath);
  }
}
