import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { SignRoles } from '@shared/features/signature-file/models/sign-roles.enum';
import { AgreementsListContainerComponent } from '../../containers/agreements-list-container/agreements-list-container.component';
import { MyDocumentsListContainerComponent } from '../../containers/my-documents-list-container/my-documents-list-container';
import { DocumentListFacade } from '../../facades/document-list-facade.service';
import { DocumentFacade } from '../../facades/document-facade.service';
import { MyDocumentsListFacade } from '../../facades/my-documents-list.facade';
import { DocumentFilterInterface } from '../../models/agreement.interface';

@Component({
    template: '<ng-container #container></ng-container>',
    standalone: false
})
export class AgreementTypeResolverComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef, static: true })
  container: ViewContainerRef;

  constructor(
    private router: Router,
    private documentPageFacade: DocumentFacade,
    private myDocumentsFacade: MyDocumentsListFacade,
    private documentListFacade: DocumentListFacade
  ) {}

  ngOnInit(): void {
    this.createComponent();
  }

  private createComponent(): void {
    let component;
    let params: DocumentFilterInterface;
    const section = this.getSection();
    switch (section) {
      case 'my-documents':
        component = MyDocumentsListContainerComponent;
        params = {
          forEmployee: 'true',
          role: SignRoles.employee,
        };
        this.myDocumentsFacade.setAdditionalParams(params);
        break;
      case 'documents':
        component = AgreementsListContainerComponent;
        params = {
          forEmployee: 'false',
          role: SignRoles.org,
        };
        this.documentListFacade.setAdditionalParams(params);
        break;
      default:
        break;
    }
    this.documentPageFacade.setAdditionalParams(params);
    this.container.createComponent(component);
  }

  private getSection(): string {
    return this.router.url.split('/')[1].split('?')[0];
  }
}
