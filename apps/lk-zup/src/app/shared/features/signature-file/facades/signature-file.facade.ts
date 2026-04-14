import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../classes/abstractions/abstract.facade';
import { FileToDownloadInterface } from '../models/file-to-download.interface';
import { SignatureFileState } from '../states/signature-file.state';

@Injectable({
  providedIn: 'root',
})
export class SignatureFileFacade extends AbstractFacade<FileToDownloadInterface> {
  constructor(protected geRx: GeRx, protected store: SignatureFileState) {
    super(geRx, store);
  }
}
