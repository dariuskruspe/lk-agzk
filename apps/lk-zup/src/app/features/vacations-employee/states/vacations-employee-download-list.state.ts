import { Injectable } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { StateInterface } from '../../../shared/models/state.interface';
import { FileDownloadService } from '../../../shared/services/file-download.service';
import { FileSanitizerClass } from '../../../shared/utilits/download-file.utils';
import { VacationEmployeeDownloadInterface } from '../models/vacations.interface';
import { VacationsEmployeeService } from '../sevices/vacations-employee.service';

@Injectable({
  providedIn: 'root',
})
export class VacationsEmployeeDownloadListState implements StateInterface {
  public entityName = 'vacationsEmployeeDownloadListState';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.downloadByIds,
      success: this.download,
    },
  };

  constructor(
    private vacationsEmployeeService: VacationsEmployeeService,
    protected localstorageService: LocalStorageService,
    private fileSanitizer: FileSanitizerClass,
    private fileDownload: FileDownloadService
  ) {}

  downloadByIds(param: {
    ids: string[];
    date: Date;
    format: 'xlsx' | 'pdf';
  }): Observable<{ src: SafeResourceUrl; name: string }> {
    const currentEmployeeId = this.localstorageService.getCurrentEmployeeId();
    return (
      this.vacationsEmployeeService.downloadSelected(
        param.ids,
        currentEmployeeId,
        param.date,
        param.format
      ) as Observable<VacationEmployeeDownloadInterface>
    ).pipe(
      map((file) => ({
        name: file.fileName,
        src: this.fileSanitizer.getSafeResourceURLFromFileBase64Data(
          file.file64,
          file.fileExtension
        ),
      }))
    );
  }

  download(result: {
    src: SafeResourceUrl;
    name: string;
  }): Observable<unknown> {
    return of(this.fileDownload.download(result.src, result.name));
  }
}
