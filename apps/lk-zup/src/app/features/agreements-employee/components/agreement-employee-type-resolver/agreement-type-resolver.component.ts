import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { AgreementsEmployeeListContainerComponent } from '@features/agreements-employee/containers/agreements-employee-list-container/agreements-employee-list-container.component';
import { SignRoles } from '@shared/features/signature-file/models/sign-roles.enum';
import { MyDocumentsListContainerComponent } from '../../containers/my-documents-list-container/my-documents-list-container';
import { AgreementEmployeeListFacade } from '../../facades/agreement-employee-list.facade';
import { AgreementsEmployeeDocumentPageFacade } from '../../facades/agreements-employee-document-page.facade';
import { MyDocumentsListFacade } from '../../facades/my-documents-list.facade';
import { AgreementEmployeeFilterInterface } from '../../models/agreement-employee.interface';

@Component({
    template: '<ng-container #container></ng-container>',
    standalone: false
})
export class AgreementEmployeeTypeResolverComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef, static: true })
  container: ViewContainerRef;

  constructor(
    private cfr: ComponentFactoryResolver,
    private router: Router,
    private documentPageFacade: AgreementsEmployeeDocumentPageFacade,
    private myDocumentsFacade: MyDocumentsListFacade,
    private agreementsEmployeeFacade: AgreementEmployeeListFacade
  ) {}

  ngOnInit(): void {
    this.createComponent();
  }

  private createComponent(): void {
    let component;
    let params: AgreementEmployeeFilterInterface;
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
      case 'documents-employee':
        component = AgreementsEmployeeListContainerComponent;
        params = {
          forEmployee: 'false',
          role: SignRoles.manager,
        };
        this.agreementsEmployeeFacade.setAdditionalParams(params);
        break;
      default:
        break;
    }
    this.documentPageFacade.setAdditionalParams(params);
    const factory = this.cfr.resolveComponentFactory(component);
    this.container.createComponent(factory);
  }

  private getSection(): string {
    return this.router.url.split('/')[1].split('?')[0];
  }
}
