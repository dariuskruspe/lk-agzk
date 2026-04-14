import { NgStyle } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  SecurityContext,
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { LangModule } from '@shared/features/lang/lang.module';
import Cropper from 'cropperjs';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
    selector: 'app-image-cropper',
    templateUrl: './image-cropper.component.html',
    styleUrls: ['./image-cropper.component.scss'],
    imports: [ButtonModule, LangModule, ToolbarModule, NgStyle],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageCropperComponent implements OnInit, AfterViewInit, OnDestroy {
  sanitizedUrl!: SafeUrl;
  cropper!: Cropper;

  /**
   * Файл изображения, выбранный пользователем со своего компьютера, для будущего аватара.
   */
  image: string = this.dialogConfig?.data?.image;

  /**
   * Высота изображения.
   */
  height: string = this.dialogConfig?.data?.imgHeight || '600px';

  /**
   * Шаг смещения (в пикселях) при перемещении картинки стрелочками.
   */
  offset: number = 1;

  /**
   * Коэффициент масштабирования (для zoom).
   *
   * Положительное значение = приближение (zoom+).
   * Отрицательное значение = отдаление (zoom-).
   */
  zoomRatio: number = 0.05;

  @HostListener('document:keydown', ['$event'])
  handleTheKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
      case 'w':
        event.preventDefault();
        this.moveY(-this.offset);
        break;
      case 'ArrowRight':
      case 'd':
        event.preventDefault();
        this.moveX(this.offset);
        break;
      case 'ArrowDown':
      case 's':
        event.preventDefault();
        this.moveY(this.offset);
        break;
      case 'ArrowLeft':
      case 'a':
        event.preventDefault();
        this.moveX(-this.offset);
        break;
      case '+':
      case '=':
        event.preventDefault();
        this.zoom(this.zoomRatio);
        break;
      case '-':
        event.preventDefault();
        this.zoom(-this.zoomRatio);
        break;
    }
  }

  constructor(
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.sanitizedUrl = this.sanitizer.sanitize(
      SecurityContext.HTML,
      this.image
    );
  }

  ngAfterViewInit(): void {
    this.initCropper();
  }

  ngOnDestroy(): void {
    this.cropper.destroy();
  }

  initCropper(): void {
    const image = document.getElementById('image') as HTMLImageElement;
    this.cropper = new Cropper(image, {
      aspectRatio: 1,
      viewMode: 1,
      guides: false,
    });
    this.cropper.setDragMode('crop');
  }

  getRoundedCanvas(sourceCanvas: HTMLCanvasElement): HTMLCanvasElement {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    const context: CanvasRenderingContext2D = canvas.getContext('2d');
    const { width, height } = sourceCanvas;

    canvas.width = width;
    canvas.height = height;
    context.imageSmoothingEnabled = false;
    context.drawImage(sourceCanvas, 0, 0, width, height);
    context.globalCompositeOperation = 'destination-in';
    context.beginPath();
    context.arc(
      width / 2,
      height / 2,
      Math.min(width, height) / 2,
      0,
      2 * Math.PI,
      true
    );
    context.fill();
    return canvas;
  }

  crop(): void {
    const croppedCanvas = this.cropper.getCroppedCanvas();
    const roundedCanvas = this.getRoundedCanvas(croppedCanvas);

    const roundedImage = document.createElement('img');

    if (roundedImage) {
      this.dialogRef.close(roundedCanvas.toDataURL());
    } else {
      return this.dialogRef.close(null);
    }
  }

  reset(): void {
    this.cropper.clear();
    this.cropper.reset();
    this.cropper.crop();
  }

  zoom(zoomRatio: number = this.zoomRatio): void {
    this.cropper.zoom(zoomRatio);
  }

  moveX(offsetX: number = this.offset): void {
    this.cropper.move(offsetX, 0);
  }

  moveY(offsetY: number = this.offset): void {
    this.cropper.move(0, offsetY);
  }
}
