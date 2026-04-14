import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { logWarn } from '@shared/utilits/logger';
import { Environment } from '../../classes/ennvironment/environment';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class PdfViewerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('frame') pdfViewer: ElementRef;

  @Input() set value(value: string | Uint8Array) {
    if (!value) {
      // Критично для модального режима: очищаем файл, чтобы старый не оставался в памяти
      this.fileUint8Array = null;
      this.fileTimestamp = 0;
      this.lastOpenedFileTimestamp = 0;
      this.valueSetTimestamp = 0;
      this.valueSetFileSize = 0;
      if (this.pdfViewerApplication?.initialized) {
        try {
          this.pdfViewerApplication.open({ data: new Uint8Array(0) });
        } catch (e) {
          logWarn(e);
        }
      }
      return;
    }

    let newFileUint8Array: Uint8Array;
    if (typeof value === 'string') {
      newFileUint8Array = new Uint8Array(
        atob(value)
          .split('')
          .map((char) => char.charCodeAt(0)),
      );
    } else if (value instanceof Uint8Array) {
      // Создаем полную копию массива для избежания проблем с кешированием
      newFileUint8Array = new Uint8Array(value.length);
      newFileUint8Array.set(value);
    } else {
      throw new Error('[pdf-viewer]: unknown type of file');
    }

    // Сравниваем длину и первые/последние байты для надежной проверки изменения файла
    const fileChanged =
      !this.fileUint8Array ||
      this.fileUint8Array.length !== newFileUint8Array.length ||
      (this.fileUint8Array.length > 0 &&
        newFileUint8Array.length > 0 &&
        (this.fileUint8Array[0] !== newFileUint8Array[0] ||
          this.fileUint8Array[this.fileUint8Array.length - 1] !==
            newFileUint8Array[newFileUint8Array.length - 1]));

    // Всегда обновляем fileUint8Array для использования нового экземпляра
    const currentTimestamp = Date.now();
    this.fileTimestamp = currentTimestamp;
    this.fileUint8Array = newFileUint8Array;
    // Сохраняем timestamp и размер для проверки в ngAfterViewInit
    this.valueSetTimestamp = currentTimestamp;
    this.valueSetFileSize = newFileUint8Array.length;

    if (!fileChanged) {
      return;
    }

    const params = [];

    let viewerPostfix = '';

    if (Environment.isMobileApp()) {
      params.push('disableworker=true');
      viewerPostfix = '-m';
      this.isMobile = true;
    }

    if (fileChanged) {
      const timestamp = Date.now();
      params.push(`_t=${timestamp}`);
    }

    let url = `${
      Environment.inv().baseHref
    }assets/pdfjs-dist/web/viewer${viewerPostfix}.html`;

    if (params.length) {
      url = `${url}?${params.join('&')}`;
    }

    this.viewerSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);

    if (this.pdfViewerApplication?.initialized && fileChanged) {
      this.openPdfFile(currentTimestamp);
    }
  }

  isMobile = false;

  viewerSrc: SafeResourceUrl;

  /**
   * Бинарные данные файла документа (в виде Uint8Array).
   */
  private fileUint8Array: Uint8Array;

  /**
   * Timestamp последнего установленного файла для отслеживания актуальности
   */
  private fileTimestamp: number = 0;

  /**
   * Timestamp последнего успешно открытого файла
   * Используется для предотвращения открытия старого файла после открытия нового
   */
  private lastOpenedFileTimestamp: number = 0;

  /**
   * Timestamp и размер файла на момент установки через value setter
   * Используется для проверки в ngAfterViewInit, что файл не изменился
   */
  private valueSetTimestamp: number = 0;
  private valueSetFileSize: number = 0;

  private listener: (event: Event) => void;

  // PDFViewerApplication
  private pdfViewerApplication: {
    initializedPromise: Promise<void>;
    initialized: boolean;
    open: (data: { data: Uint8Array }) => void;
  };

  constructor(private sanitizer: DomSanitizer) {}

  private async openPdfFile(requestTimestamp?: number): Promise<void> {
    const currentFileTimestamp = this.fileTimestamp;
    if (requestTimestamp !== undefined) {
      if (requestTimestamp < currentFileTimestamp) {
        return;
      }
      if (
        this.lastOpenedFileTimestamp > 0 &&
        requestTimestamp < this.lastOpenedFileTimestamp
      ) {
        return;
      }
    }

    if (!this.fileUint8Array || !this.pdfViewerApplication) {
      return;
    }

    try {
      if (!this.pdfViewerApplication.initialized) {
        await this.pdfViewerApplication.initializedPromise;

        // Проверяем, что файл не устарел после инициализации
        if (
          requestTimestamp !== undefined &&
          requestTimestamp < this.fileTimestamp
        ) {
          return;
        }
      }

      // Не открываем файл со старым timestamp, если уже открыт более новый
      if (
        requestTimestamp !== undefined &&
        this.lastOpenedFileTimestamp > requestTimestamp
      ) {
        return;
      }

      this.pdfViewerApplication.open({
        data: this.fileUint8Array,
      });
      this.lastOpenedFileTimestamp = currentFileTimestamp;
    } catch (e) {
      logWarn(e);
    }
  }

  ngAfterViewInit(): void {
    this.listener = async (event) => {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.pdfViewerApplication = event.detail.source?.PDFViewerApplication;
        await this.pdfViewerApplication.initializedPromise;

        // Задержка для гарантии, что value setter успел обновить данные
        await new Promise((resolve) => setTimeout(resolve, 10));

        const currentTimestamp = this.fileTimestamp;
        const currentFileSize = this.fileUint8Array?.length;

        // Проверяем, что файл установлен и актуален
        if (
          currentTimestamp === 0 ||
          !currentFileSize ||
          currentFileSize === 0
        ) {
          return;
        }

        // Проверяем, что timestamp и размер совпадают с установленными через value setter
        if (
          this.valueSetTimestamp > 0 &&
          (currentTimestamp !== this.valueSetTimestamp ||
            currentFileSize !== this.valueSetFileSize)
        ) {
          return;
        }

        // Не открываем старый файл, если уже был открыт более новый
        if (
          this.lastOpenedFileTimestamp > 0 &&
          currentTimestamp < this.lastOpenedFileTimestamp
        ) {
          return;
        }

        this.openPdfFile(currentTimestamp);
      } catch (e) {
        logWarn(e);
      }
    };
    document.addEventListener('webviewerloaded', this.listener);
  }

  ngOnDestroy(): void {
    // Очищаем состояние для предотвращения использования старых данных при пересоздании
    this.fileUint8Array = null;
    this.fileTimestamp = 0;
    this.lastOpenedFileTimestamp = 0;
    this.valueSetTimestamp = 0;
    this.valueSetFileSize = 0;
    this.pdfViewerApplication = null;
    document.removeEventListener('webviewerloaded', this.listener);
  }
}
