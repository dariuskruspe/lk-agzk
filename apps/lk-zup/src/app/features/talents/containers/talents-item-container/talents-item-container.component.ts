import { ChangeDetectorRef, Component, inject, Inject, OnDestroy, OnInit, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BREADCRUMB, provideBreadcrumb } from '@features/main/utils/breadcrumb-provider.utils';
import { Preloader, providePreloader } from '@shared/services/preloader.service';
import { ProgressBar } from 'primeng/progressbar';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { TalentsService } from '@features/talents/sevices/talents.service';
import { TalentItemInterface } from '@features/talents/models/talents.interface';
import { Environment } from '../../../../shared/classes/ennvironment/environment';
import {
  IssuesAddDialogContainerComponent
} from '@features/issues/containers/issues-add-dialog-container/issues-add-dialog-container.component';
import { DialogService } from 'primeng/dynamicdialog';
import { CustomDialogService } from '@shared/services/dialog.service';
import mime from 'mime';
import { take } from 'rxjs/operators';
import {
  DeleteTalentDialogComponent
} from '@features/talents/components/delete-talent-dialog/delete-talent-dialog.component';
import { TranslatePipe } from '@shared/features/lang/pipes/lang.pipe';
import { AppService } from '@shared/services/app.service';
import { SettingsInterface } from '@shared/features/settings/models/settings.interface';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { Location } from '@angular/common';

@Component({
    selector: 'app-talents-item-container',
    templateUrl: './talents-item-container.component.html',
    styleUrls: ['./talents-item-container.component.scss'],
    providers: [
        providePreloader(ProgressBar),
        provideBreadcrumb('TALENTS', 0),
        {
            provide: DialogService,
            useClass: CustomDialogService,
        },
    ],
    standalone: false
})
export class TalentsItemContainerComponent implements OnInit, OnDestroy {
  app: AppService = inject(AppService);

  settingsSignal: WritableSignal<SettingsInterface> =
    this.app.storage.settings.data.frontend.signal.globalSettings;

  loading$ = new BehaviorSubject<boolean>(true);

  talentItem: TalentItemInterface;

  talentStorageData: {
    fullName: string;
    division: string;
    photo: string;
    image64: string;
    imageExt: string;
    position: string;
    userID: string;
  };

  photo: string;

  apiUrl = Environment.inv().api;

  constructor(
    private talentsService: TalentsService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(BREADCRUMB) private _: unknown,
    private ref: ChangeDetectorRef,
    private dialogService: DialogService,
    private translatePipe: TranslatePipe,
    private preloader: Preloader,
    public localStorageService: LocalStorageService,
    private location: Location,
  ) {}

  async ngOnInit(): Promise<void> {
    this.loading$.next(true);
    this.preloader.setCondition(this.loading$);
    const employeeItemId = this.route.snapshot.params.id;
    this.talentStorageData = JSON.parse(
      localStorage.getItem('talentEmployeeData'),
    );
    if (!this.talentStorageData) {
      await this.getTalentEmployeeData(employeeItemId);
    }
    if (this.talentStorageData.photo) {
      this.photo = this.talentStorageData.photo;
    } else if (
      this.talentStorageData.imageExt &&
      this.talentStorageData.image64
    ) {
      const imageExtension = this.talentStorageData.imageExt;

      const imageMimeType = mime.getType(imageExtension);

      const {image64} = this.talentStorageData;

      this.photo = `data:${imageMimeType};base64,${image64}`;
    }
    this.getItem(employeeItemId).then(() => {
      this.ref.detectChanges();
    });
    this.loading$.next(false);
  }

  async getTalentEmployeeData(id: string) {
    const employees = await firstValueFrom(
      this.talentsService.getTalentsList({page: 1, count: 100, useSkip: false}),
    );
    this.talentStorageData = employees.subordinates.find((sub) => sub.employeeID === id);
  }

  async getItem(id: string): Promise<void> {
    this.talentItem = await firstValueFrom(
      this.talentsService.getTalentsItemById(id),
    );
    this.loading$.next(false);
  }

  onBackPage(): void {
    this.location.back();
  }

  removeTalent(talentId: string): void {
    const dialog = this.dialogService.open(DeleteTalentDialogComponent, {
      data: {
        talentId,
        // employeeId: this.talentItem.employeeID,
        // userId: this.talentStorageData.userID,
        employeeId: this.localStorageService.getCurrentEmployeeId(),
        userId: this.app.storage.user.current.data.backend.currentUser.userID,
        issueEmployee: this.talentStorageData.userID,
      },
      closable: true,
      dismissableMask: true,
      header: this.translatePipe.transform('DELETE'),
    });
    dialog.onClose.pipe(take(1)).subscribe((result) => {
      if (result) {
        const employeeItemId = this.route.snapshot.params.id;
        this.getItem(employeeItemId).then(() => {
          this.ref.detectChanges();
        });
      }
    });
  }

  addTalent(): void {
    const alias = 'talentAdd';
    this.dialogService.open(IssuesAddDialogContainerComponent, {
      data: {
        alias,
        formData: { issueEmployee: this.talentStorageData.userID },
      },
      closable: true,
    });
  }

  ngOnDestroy() {
    localStorage.removeItem('talentEmployeeData');
  }

  protected readonly encodeURI = encodeURI;
}
