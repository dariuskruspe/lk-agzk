import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentTypeListFacade } from '@features/agreements/facades/document-type-list-facade.service';
import { ProvidersFacade } from '@shared/features/signature-validation-form/facades/providers.facade';
import { Preloader } from '@shared/services/preloader.service';
import { AbstractDocumentListFacade } from '../../facades/abstract-document-list-facade.service';
import { DocumentStateFacade } from '../../facades/document-state-facade.service';
import { DocumentInterface } from '../../models/document.interface';
import { DocumentFilterInterface } from '../../models/agreement.interface';

@Component({
    template: '',
    standalone: false
})
export class AbstractDocumentListContainerComponent implements OnInit {
  public title = 'SIGNED_DOCUMENTS';

  currentPage = signal<number>(1);

  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    public documentListFacade: AbstractDocumentListFacade,
    public documentStateFacade: DocumentStateFacade,
    protected preloader: Preloader,
    public providersFacade: ProvidersFacade,
    public agreementTypesListFacade: DocumentTypeListFacade,
    private route: ActivatedRoute,
  ) {
    this.preloader.setCondition(
      this.documentListFacade.loading$(),
      this.documentStateFacade.loading$(),
      this.agreementTypesListFacade.loading$()
    );
  }

  ngOnInit() {
    this.agreementTypesListFacade.getDocumentTypes();
  }

  openDocument(doc: DocumentInterface & { index: number }): void {
    const page = ((this.currentPage() - 1)*15 + doc.index + 1) || 1;
    const queryParams: { page: number, state?: string } = { page };
    const { state } = this.route.snapshot.queryParams;
    if (state) {
      queryParams.state = state;
    }
    this.router
      .navigate([doc.fileOwner, doc.id], { relativeTo: this.activatedRoute, queryParams })
      .then();
  }

  onLoadList(filterData: DocumentFilterInterface): void {
    if (filterData.page) {
      this.currentPage.set(+filterData.page);
    }
    const filter: DocumentFilterInterface = filterData;
    filter.searchTarget = ['name'];
    this.documentListFacade.getDocumentList(filter);
  }
}
