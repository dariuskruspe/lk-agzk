import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../classes/abstractions/abstract.facade';
import { FileToDownloadInterface } from '../models/file-to-download.interface';
import { ArchFileState } from '../states/arch-file.state';

@Injectable({
  providedIn: 'root',
})
export class ArchFileFacade extends AbstractFacade<FileToDownloadInterface> {
  constructor(protected geRx: GeRx, protected store: ArchFileState) {
    super(geRx, store);
  }
}
