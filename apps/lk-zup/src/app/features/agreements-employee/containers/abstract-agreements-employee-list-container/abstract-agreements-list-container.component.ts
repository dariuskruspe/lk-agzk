import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentStateFacade } from '@features/agreements/facades/document-state-facade.service';
import { ProvidersFacade } from '@shared/features/signature-validation-form/facades/providers.facade';
import { Preloader } from '@shared/services/preloader.service';
import { AbstractAgreementEmployeeListFacade } from '../../facades/abstract-agreement-employee-list.facade';
import { AgreementEmployeeTypesListFacade } from '../../facades/agreement-employee-types-list.facade';
import { AgreementEmployeeDocumentPageInterface } from '../../models/agreement-employee-document-page.interface';
import { AgreementEmployeeFilterInterface } from '../../models/agreement-employee.interface';

@Component({
    template: '',
    standalone: false
})
export class AbstractAgreementsEmployeeListContainerComponent
  implements OnInit
{
  public title = 'SIGNED_DOCUMENTS_EMPLOYEE';

  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    public agreementsEmployeeListFacade: AbstractAgreementEmployeeListFacade,
    public agreementDocumentStateFacade: DocumentStateFacade,
    protected preloader: Preloader,
    public providersFacade: ProvidersFacade,
    public agreementEmployeeTypesListFacade: AgreementEmployeeTypesListFacade
  ) {
    this.preloader.setCondition(
      this.agreementsEmployeeListFacade.loading$(),
      this.agreementDocumentStateFacade.loading$(),
      this.agreementEmployeeTypesListFacade.loading$()
    );
  }

  ngOnInit() {
    this.agreementEmployeeTypesListFacade.getDocumentTypes();
  }

  openDocument(data: AgreementEmployeeDocumentPageInterface): void {
    this.router
      .navigate([data.fileOwner, data.id], { relativeTo: this.activatedRoute })
      .then();
  }

  onGetAgreementsEmployeeList(
    filterData: AgreementEmployeeFilterInterface
  ): void {
    const filter: AgreementEmployeeFilterInterface = filterData;
    filter.searchTarget = ['name'];
    this.agreementsEmployeeListFacade.getAgreementsEmployeeList(filter);
  }
}
