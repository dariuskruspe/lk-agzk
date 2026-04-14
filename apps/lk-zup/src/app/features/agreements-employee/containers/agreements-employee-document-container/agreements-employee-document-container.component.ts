import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProgressBar } from 'primeng/progressbar';
import {
  Preloader,
  providePreloader,
} from '../../../../shared/services/preloader.service';
import { BreadcrumbsService } from '../../../main/services/breadcrumbs.service';
import {
  BREADCRUMB,
  provideBreadcrumb,
} from '../../../main/utils/breadcrumb-provider.utils';
import { AgreementsEmployeeDocumentPageFacade } from '../../facades/agreements-employee-document-page.facade';
import { AgreementsEmployeeDocumentItem } from '../../models/agreement-employee-document.interface';

@Component({
    selector: 'app-agreements-employee-document-container',
    templateUrl: './agreements-employee-document-container.component.html',
    styleUrls: ['./agreements-employee-document-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideBreadcrumb('SHOW_DOCUMENT_PAGE', 1),
        providePreloader(ProgressBar),
    ],
    standalone: false
})
export class AgreementsEmployeeDocumentContainerComponent implements OnInit {
  data: AgreementsEmployeeDocumentItem;

  constructor(
    private activatedRoute: ActivatedRoute,
    public agreementsEmployeeDocumentPageFacade: AgreementsEmployeeDocumentPageFacade,
    @Inject(BREADCRUMB) private _: unknown,
    private breadcrumbs: BreadcrumbsService,
    private preloader: Preloader
  ) {
    this.preloader.setCondition(
      this.agreementsEmployeeDocumentPageFacade.forcedLoading$
    );
  }

  ngOnInit(): void {
    this.agreementsEmployeeDocumentPageFacade.getDocumentPage({
      fileOwner: this.activatedRoute.snapshot.params.owner,
      id: this.activatedRoute.snapshot.params.id,
    });
  }

  backPage(): void {
    this.breadcrumbs.goBack();
  }

  closeFile(result: unknown): void {
    if (result) {
      this.ngOnInit();
    }
  }
}
