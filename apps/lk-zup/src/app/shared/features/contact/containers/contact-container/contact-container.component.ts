import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LangFacade } from '../../../lang/facades/lang.facade';
import { LangUtils } from '../../../lang/utils/lang.utils';
import { MessageSnackbarService } from '../../../message-snackbar/message-snackbar.service';
import { MessageType } from '../../../message-snackbar/models/message-type.enum';
import { ContactsInterface } from '../../models/contact.interface';
import { ContactApiService } from '../../services/contact-api.service';

@Component({
    templateUrl: './contact-container.component.html',
    styleUrls: ['./contact-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ContactContainerComponent implements OnDestroy {
  loading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private contactApi: ContactApiService,
    private dialogRef: DynamicDialogRef,
    private toast: MessageSnackbarService,
    private langUtils: LangUtils,
    private langFacade: LangFacade
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submitForm(data: ContactsInterface): void {
    this.contactApi
      .sendContacts(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.toast.show(
            {
              message: this.langUtils.convert(
                this.langFacade.getLang(),
                'CONTACT_DATA_SENT'
              ),
            },
            MessageType.success
          );
        },
        () => {},
        () => {
          this.dialogRef.close(true);
        }
      );
  }
}
