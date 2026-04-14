import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FpcInputsInterface,
  FpcInterface,
} from '@wafpc/base/models/fpc.interface';
import { Subject } from 'rxjs';
import { LangFacade } from '../../../lang/facades/lang.facade';
import { LangUtils } from '../../../lang/utils/lang.utils';
import {
  OwnerFilesViewDownloadItemInterface,
  OwnerFilesViewDownloadListInterface,
} from '../../models/owner-files-view-download.interface';

@Component({
    selector: 'app-owner-files-view-download',
    templateUrl: './owner-files-view-download.component.html',
    styleUrls: ['./owner-files-view-download.component.scss'],
    standalone: false
})
export class OwnerFilesViewDownloadComponent implements OnChanges {
  inputs: FpcInputsInterface[] = [
    {
      type: 'file-multi',
      formControlName: 'files',
      label: this.langUtils.convert(this.langFacade.getLang(), 'FILES'),
      placeholder: '',
      gridClasses: ['com-12'],
      validations: [],
      edited: true,
    },
  ];

  config: FpcInterface = {
    options: {
      changeStrategy: 'push',
      appearanceElements: 'outline',
      editMode: false,
      viewMode: 'show',
      submitDebounceTime: 5000,
    },
    template: this.inputs,
  };

  filesFormShowConfig: Subject<FpcInterface> = new Subject<FpcInterface>();

  @Input() ownerFilesList: OwnerFilesViewDownloadListInterface[];

  @Input() fileItem: OwnerFilesViewDownloadItemInterface;

  @Output() getFile = new EventEmitter<OwnerFilesViewDownloadListInterface>();

  constructor(private langFacade: LangFacade, private langUtils: LangUtils) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.ownerFilesList?.currentValue) {
      this.config.data = { files: this.ownerFilesList };
      this.filesFormShowConfig.next(this.config);
    }
  }

  onGetFile(fileParam: { fileID: string; reqScript: string }): void {
    const file = this.ownerFilesList.find(
      (e) =>
        e.fileID === fileParam.fileID && e.reqScript === fileParam.reqScript
    );
    this.getFile.emit(file);
  }
}
