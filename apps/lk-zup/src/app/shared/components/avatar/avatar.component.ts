import { NgClass, NgIf, NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { Environment } from '@shared/classes/ennvironment/environment';
import { AppService } from '@shared/services/app.service';
import { FileUploadService } from '@shared/services/file-upload.service';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { logError, logWarn } from '@shared/utilits/logger';
import { dataURLtoBlob } from '@shared/utils/file/common';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable, firstValueFrom } from 'rxjs';
import { ImageCropperComponent } from './image-cropper/image-cropper.component';

@Component({
    selector: 'app-avatar',
    templateUrl: './avatar.component.html',
    styleUrls: ['./avatar.component.scss'],
    imports: [NgClass, NgStyle, NgIf],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarComponent {
  app: AppService = inject(AppService);
  currentUserStorage = this.app.storage.user.current;

  @Input() isEditable: boolean = false;

  @Input() width: string = '200px';
  @Input() height: string = '200px';
  @Input() boxShadow: string = 'none';

  avatarSignal = this.currentUserStorage.data.frontend.signal.avatar;
  photoURLSignal = this.currentUserStorage.data.frontend.signal.photoURL;

  isMobile: boolean = Environment.isMobileApp();

  constructor(
    // API
    private fileUploadService: FileUploadService,

    // PrimeNG
    public dialog: DialogService,

    // Other
    private localStorageService: LocalStorageService
  ) {}

  /**
   * Обработчик загрузки (upload) аватара пользователя.
   * https://github.com/ruslanpascoal2/user-experiences/blob/main/user-experiences/src/app/components/avatar/avatar.component.ts
   *
   * @param event событие, содержащее загруженную пользователем картинку (аватар)
   */
  async onAvatarChange(event: Event) {
    const files: FileList = (<HTMLInputElement>event.target)?.files;

    if (!files?.length) return;

    const _file: string = URL.createObjectURL(files[0]);
    this.resetInput();

    // Строка в виде data URL, содержащая base64-изображение обрезанной под кружочек аватарки
    let result: string;
    try {
      result = await firstValueFrom(this.openAvatarEditor(_file));
    } catch (e) {
      logError(e);
    }

    if (!result) return;

    this.avatarSignal.set(result);

    const response = await this.uploadImage(result);
  }

  /**
   * Открываем диалоговое окно "обрезки" изображения, в котором пользователь "подгоняет" загруженную картинку под
   * кружочек аватарки. Исходное изображение при этом не обрезается, вместо этого сохраняется новое изображение.
   * @param image
   */
  openAvatarEditor(image: string): Observable<any> {
    const dialogRef = this.dialog.open(ImageCropperComponent, {
      width: this.isMobile ? '99vw' : '60vw',
      height: '90vh',
      data: { image, imgHeight: this.isMobile ? '40vh' : '50vh' },
    });

    return dialogRef.onClose;
  }

  resetInput(): void {
    const input = document.getElementById(
      'avatar-input-file'
    ) as HTMLInputElement;
    if (!input) return;
    input.value = '';
  }

  async uploadImage(imageDataURL: string = this.avatarSignal()): Promise<any> {
    // Строка, содержащая base64-изображение (аватарку)
    // const avatar64: string = imageDataURL.split(',')[1];

    // Строка, содержащая MIME-тип (MIME type) изображения (аватарки)
    // const avatarMIMEType: string = imageDataURL.split(':')[1].split(';')[0];

    // Blob, содержащий двоичные данные и MIME-тип файла аватарки
    const avatarBlob: Blob = dataURLtoBlob(imageDataURL);

    const currentEmployeeId: string =
      this.localStorageService.getCurrentEmployeeId();
    if (!currentEmployeeId) {
      logWarn('Failed to get currentEmployeeId from localStorage!');
      return;
    }

    // Ответ от метода "uploadAvatar"
    let response: any;
    try {
      response = await firstValueFrom(
        this.fileUploadService.uploadAvatar(currentEmployeeId, avatarBlob)
      );
    } catch (e) {
      logError(e, 'failed to upload avatar');
    }

    return response;
  }

  protected readonly encodeURI = encodeURI;
}
