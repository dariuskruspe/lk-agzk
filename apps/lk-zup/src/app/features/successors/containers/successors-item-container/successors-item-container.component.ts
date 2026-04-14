import {
  ChangeDetectorRef,
  Component, inject,
  Inject,
  OnInit, WritableSignal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BREADCRUMB,
  provideBreadcrumb,
} from '@features/main/utils/breadcrumb-provider.utils';
import {Preloader, providePreloader} from '@shared/services/preloader.service';
import { ProgressBar } from 'primeng/progressbar';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Environment } from '../../../../shared/classes/ennvironment/environment';
import { IssuesAddDialogContainerComponent } from '@features/issues/containers/issues-add-dialog-container/issues-add-dialog-container.component';
import { DialogService } from 'primeng/dynamicdialog';
import { CustomDialogService } from '@shared/services/dialog.service';
import mime from 'mime';
import { AppService } from '@shared/services/app.service';
import { SettingsInterface } from '@shared/features/settings/models/settings.interface';
import {
  PotentialPositionInterface,
  SuccessorEmployeeInterface,
  SuccessorItemInterface
} from '@features/successors/models/successors.interface';
import { SuccessorsService } from '@features/successors/sevices/successors.service';
import { Location } from '@angular/common';

@Component({
    selector: 'app-successors-item-container',
    templateUrl: './successors-item-container.component.html',
    styleUrls: ['./successors-item-container.component.scss'],
    providers: [
        providePreloader(ProgressBar),
        provideBreadcrumb('SUCCESSORS', 0),
        {
            provide: DialogService,
            useClass: CustomDialogService,
        },
    ],
    standalone: false
})
export class SuccessorsItemContainerComponent implements OnInit {
  app: AppService = inject(AppService);

  settingsSignal: WritableSignal<SettingsInterface> =
    this.app.storage.settings.data.frontend.signal.globalSettings;

  loading$ = new BehaviorSubject<boolean>(true);

  successorsItem: SuccessorItemInterface;

  photo: string;

  apiUrl = Environment.inv().api;

  activeTab: 'SUCCESSION_PLAN' | 'ISSUE_CHANGES' = 'SUCCESSION_PLAN';

  constructor(
    private successorsService: SuccessorsService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(BREADCRUMB) private _: unknown,
    private ref: ChangeDetectorRef,
    private dialogService: DialogService,
    protected preloader: Preloader,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.preloader.setCondition(this.loading$);
    const employeeItemId = this.route.snapshot.params.id;
    this.getItem(employeeItemId).then(() => {
      this.ref.detectChanges();
    });
  }

  async getItem(id: string): Promise<void> {
    this.successorsItem = await firstValueFrom(
      this.successorsService.getSuccessorsItemById(id),
    );
    if (this.successorsItem.employeeInfo.photo) {
      this.photo = this.successorsItem.employeeInfo.photo;
    } else if (
      this.successorsItem.employeeInfo.imageExt &&
      this.successorsItem.employeeInfo.image64
    ) {
      const imageExtension = this.successorsItem.employeeInfo.imageExt;

      const imageMimeType = mime.getType(imageExtension);

      const { image64 } = this.successorsItem.employeeInfo;

      this.photo = `data:${imageMimeType};base64,${image64}`;
    }
    this.setEmployeePhoto();
    this.loading$.next(false);
  }

  setEmployeePhoto() {
    this.successorsItem.successionPlan.successors = this.successorsItem.successionPlan.successors.map((employee) => {
      let avatar: string;
      if (!employee.photo && employee.imageExt && employee.image64) {
        const imageExtension = employee.imageExt;

        const imageMimeType = mime.getType(imageExtension);

        const { image64 } = employee;

        avatar = `data:${imageMimeType};base64,${image64}`;
      }
      return {
        ...employee,
        photo: avatar,
      };
    });
    this.successorsItem.successionPlan.potentialPositions = this.successorsItem.successionPlan.potentialPositions.map((employee) => {
      let avatar: string;
      if (!employee.photo && employee.imageExt && employee.image64) {
        const imageExtension = employee.imageExt;

        const imageMimeType = mime.getType(imageExtension);

        const { image64 } = employee;

        avatar = `data:${imageMimeType};base64,${image64}`;
      }
      return {
        ...employee,
        photo: avatar,
      };
    });
  }

  onBackPage(): void {
    this.location.back();
  }

  openIssue(alias: string, formData: any): void {
    this.dialogService.open(IssuesAddDialogContainerComponent, {
      data: {
        alias,
        formData,
      },
      closable: true,
    });
  }

  addPotential() {
    const formData = {
      successorEmployee: this.successorsItem.employeeInfo.userID
    };
    this.openIssue('addPositionSucessor', formData);
  }

  editPotential(employee: PotentialPositionInterface): void {
    const formData = {
      successorEmployee: this.successorsItem.employeeInfo.userID,
      successorPositionDivision: employee.divisionID,
      successorPositionPost: employee.staffingTableID,
      successorBestCandidate: employee.bestCandidate,
      successorReadinessStatus: employee.readinessStatusID,
    };
    this.openIssue('editPositionSucessor', formData);
  }

  removePotential(employee: PotentialPositionInterface): void {
    const formData = {
      successorEmployee: this.successorsItem.employeeInfo.userID,
      successorPositionDivision: employee.divisionID,
      successorPositionPost: employee.staffingTableID,
      successorBestCandidate: employee.bestCandidate,
      successorReadinessStatus: employee.readinessStatusID,
    };
    this.openIssue('removePositionSucessor', formData);
  }

  addSuccessor(): void {
    const formData = {
      successorPositionDivision: this.successorsItem.employeeInfo.divisionID,
      successorPositionPost: this.successorsItem.employeeInfo.staffingTableID,
    };
    this.openIssue('addSuceessor', formData);
  }

  editSuccessor(employee: SuccessorEmployeeInterface): void {
    const formData = {
      successorEmployee: employee.userID,
      successorPositionDivision: this.successorsItem.employeeInfo.divisionID,
      successorPositionPost: this.successorsItem.employeeInfo.staffingTableID,
      successorBestCandidate: employee.bestCandidate,
      successorReadinessStatus: employee.readinessStatusID,
    };
    this.openIssue('editSucessor', formData);
  }

  removeSuccessor(employee: SuccessorEmployeeInterface): void {
    const formData = {
      successorEmployee: employee.userID,
      successorPositionDivision: this.successorsItem.employeeInfo.divisionID,
      successorPositionPost: this.successorsItem.employeeInfo.staffingTableID,
      successorBestCandidate: employee.bestCandidate,
      successorReadinessStatus: employee.readinessStatusID,
    };
    this.openIssue('removeSucessor', formData);
  }

  changeTab(
    tabName: 'SUCCESSION_PLAN' | 'ISSUE_CHANGES',
  ): void {
      this.activeTab = tabName;
  }

  protected readonly encodeURI = encodeURI;
}
