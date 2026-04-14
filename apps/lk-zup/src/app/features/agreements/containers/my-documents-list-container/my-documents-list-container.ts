import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentTypeListFacade } from '@features/agreements/facades/document-type-list-facade.service';
import { ProvidersFacade } from '@shared/features/signature-validation-form/facades/providers.facade';
import {
  Preloader,
  providePreloader,
} from '@shared/services/preloader.service';
import { ProgressBar } from 'primeng/progressbar';
import {
  BREADCRUMB,
  provideBreadcrumb,
} from '../../../main/utils/breadcrumb-provider.utils';
import { DocumentStateFacade } from '../../facades/document-state-facade.service';
import { MyDocumentsListFacade } from '../../facades/my-documents-list.facade';
import { AbstractDocumentListContainerComponent } from '@features/agreements/containers/abstract-document-list-container/abstract-document-list-container.component';

@Component({
  selector: 'app-my-documents-list-container',
  templateUrl:
    '../abstract-document-list-container/abstract-document-list-container.component.html',
  styleUrls: [
    '../abstract-document-list-container/abstract-document-list-container.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideBreadcrumb('TITLE_MY_DOCUMENTS', 0),
    providePreloader(ProgressBar),
  ],
  standalone: false,
})
export class MyDocumentsListContainerComponent extends AbstractDocumentListContainerComponent {
  public title = 'TITLE_MY_DOCUMENTS';

  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected preloader: Preloader,
    public documentListFacade: MyDocumentsListFacade,
    public documentStateFacade: DocumentStateFacade,
    public agreementTypesListFacade: DocumentTypeListFacade,
    public providersFacade: ProvidersFacade,
    @Inject(BREADCRUMB) private _: unknown,
  ) {
    super(
      router,
      activatedRoute,
      documentListFacade,
      documentStateFacade,
      preloader,
      providersFacade,
      agreementTypesListFacade,
      activatedRoute,
    );
  }
}
