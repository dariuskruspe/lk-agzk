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
import { AgreementEmployeeListFacade } from '../../facades/agreement-employee-list.facade';

@Component({
    selector: 'app-agreements-employee-list-container',
    templateUrl: '../../containers/abstract-agreements-employee-list-container/abstract-agreements-list-container.component.html',
    styleUrls: [
        '../../containers/abstract-agreements-employee-list-container/abstract-agreements-list-container.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideBreadcrumb('SIGNED_DOCUMENTS', 0),
        providePreloader(ProgressBar),
    ],
    standalone: false
})
export class AgreementsEmployeeListContainerComponent extends AbstractAgreementsEmployeeListContainerComponent {
  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected preloader: Preloader,
    public agreementsEmployeeListFacade: AgreementEmployeeListFacade,
    public agreementEmployeeTypesListFacade: AgreementEmployeeTypesListFacade,
    public agreementDocumentStateFacade: DocumentStateFacade,
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
