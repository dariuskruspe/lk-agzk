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
import { DocumentListFacade } from '../../facades/document-list-facade.service';
import { AbstractDocumentListContainerComponent } from '@features/agreements/containers/abstract-document-list-container/abstract-document-list-container.component';

@Component({
    selector: 'app-agreements-list-container',
    templateUrl: '../abstract-document-list-container/abstract-document-list-container.component.html',
    styleUrls: [
        '../abstract-document-list-container/abstract-document-list-container.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideBreadcrumb('SIGNED_DOCUMENTS', 0),
        providePreloader(ProgressBar),
    ],
    standalone: false
})
export class AgreementsListContainerComponent extends AbstractDocumentListContainerComponent {
  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected preloader: Preloader,
    public documentListFacade: DocumentListFacade,
    public agreementTypesListFacade: DocumentTypeListFacade,
    public documentStateFacade: DocumentStateFacade,
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
