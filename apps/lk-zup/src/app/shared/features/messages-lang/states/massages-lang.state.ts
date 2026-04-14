import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { GeRxMethods } from 'gerx/index.interface';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { LocalStorageService } from '../../../services/local-storage.service';
import { ChangeMessagesLangComponent } from '../components/change-messages-lang/change-messages-lang.component';
import { MessagesLangService } from '../services/messages-lang.service';

@Injectable({
  providedIn: 'root',
})
export class MessagesLangState {
  public entityName = 'messagesLang';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.messagesLangApi.getMessagesLang.bind(this.messagesLangApi),
      success: this.handle,
    },
    edit: {
      main: this.messagesLangApi.setMessagesLang.bind(this.messagesLangApi),
    },
  };

  constructor(
    private messagesLangApi: MessagesLangService,
    private dialogService: DialogService,
    private localstorageService: LocalStorageService,
    private geRx: GeRx,
  ) {}

  handle(res: { language: string }): Observable<{ language: string }> {
    const localLang = this.localstorageService.getCurrentLang();
    if (localLang !== res.language) {
      const dialog = this.dialogService.open(ChangeMessagesLangComponent, {
        closable: true,
        dismissableMask: true,
      });
      dialog.onClose.pipe(take(1)).subscribe((v) => {
        if (v) {
          this.geRx.edit(this.entityName, localLang);
        }
      });
    }
    return of({ language: res.language });
  }
}
