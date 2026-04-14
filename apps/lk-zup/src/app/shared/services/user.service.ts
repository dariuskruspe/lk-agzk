import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MainCurrentUserInterface } from '@features/main/models/main-current-user.interface';
import { Environment } from '@shared/classes/ennvironment/environment';
import { Observable } from 'rxjs';
// eslint-disable-next-line import/no-extraneous-dependencies
import { AppService } from '@shared/services/app.service';
import mime from 'mime';
import { UserCurrentResource } from '../api-resources/user-current.resource';
import { injectResource } from './api-resource';

@Injectable({ providedIn: 'root' })
export class UserService {
  app: AppService = inject(AppService);

  private userCurrentResource = injectResource(UserCurrentResource);

  apiURL: string = Environment.inv().api;

  /**
   * URL фотографии текущего пользователя.
   */
  photoURL: string = '';

  constructor(public http: HttpClient) {}

  getCurrentUser(): Observable<MainCurrentUserInterface> {
    return this.userCurrentResource.asObservable();
  }

  initCurrentUserAvatar(): void {
    const currentUserStorage = this.app.storage.user.current;
    const { currentUser } = currentUserStorage.data.backend;
    if (!currentUser) return;

    this.photoURL =
      this.apiURL && currentUser?.photo
        ? this.apiURL + currentUser?.photo + '?size=600x600'
        : '';
    currentUserStorage.data.frontend.signal.photoURL.set(this.photoURL);

    const imageExtension: string = currentUser?.imageExt;
    if (!imageExtension) return;

    const imageMimeType: string = mime.getType(imageExtension);
    if (!imageMimeType) return;

    const image64: string = currentUser?.image64;
    if (!image64) return;

    const avatar: string = `data:${imageMimeType};base64,${image64}`;
    currentUserStorage.data.frontend.signal.avatar.set(avatar);
  }
}
