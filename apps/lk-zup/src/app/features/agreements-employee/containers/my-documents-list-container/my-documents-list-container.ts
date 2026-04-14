import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgreementEmployeeTypesListFacade } from '@features/agreements-employee/facades/agreement-employee-types-list.facade';
import { DocumentStateFacade } from '@features/agreements/facades/document-state-facade.service';
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
import { AbstractAgreementsEmployeeListContainerComponent } from '../../containers/abstract-agreements-employee-list-container/abstract-agreements-list-container.component';
import { MyDocumentsListFacade } from '../../facades/my-documents-list.facade';

@Component({
    selector: 'app-my-documents-list-container',
    templateUrl: '../../containers/abstract-agreements-employee-list-container/abstract-agreements-list-container.component.html',
    styleUrls: [
        '../../containers/abstract-agreements-employee-list-container/abstract-agreements-list-container.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideBreadcrumb('TITLE_MY_DOCUMENTS', 0),
        providePreloader(ProgressBar),
    ],
    standalone: false
})
export class MyDocumentsListContainerComponent extends AbstractAgreementsEmployeeListContainerComponent {
  public title = 'TITLE_MY_DOCUMENTS';

  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected preloader: Preloader,
    public agreementsEmployeeListFacade: MyDocumentsListFacade,
    public agreementDocumentStateFacade: DocumentStateFacade,
    public agreementEmployeeTypesListFacade: AgreementEmployeeTypesListFacade,
    public providersFacade: ProvidersFacade,
    @Inject(BREADCRUMB) private _: unknown
  ) {
    super(
      router,
      activatedRoute,
      agreementsEmployeeListFacade,
      agreementDocumentStateFacade,
      preloader,
      providersFacade,
      agreementEmployeeTypesListFacade
    );
  }
}
