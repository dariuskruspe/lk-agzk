import {
  ChangeDetectorRef,
  Component,
  inject,
  Inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BREADCRUMB,
  provideBreadcrumb,
} from '@features/main/utils/breadcrumb-provider.utils';
import { AppService } from '@shared/services/app.service';
import { CustomDialogService } from '@shared/services/dialog.service';
import { providePreloader } from '@shared/services/preloader.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ProgressBar } from 'primeng/progressbar';
import { firstValueFrom, Observable } from 'rxjs';
import { SurveysManagementService } from '@features/surveys-management/sevices/surveys-management.service';
import {
  SurveyRequestInterface,
  SurveyResultRequestInterface,
} from '@features/surveys-management/models/surveys-management.interface';
import moment from 'moment/moment';

@Component({
    selector: 'app-surveys-employee-item-container',
    templateUrl: './surveys-employee-item-container.component.html',
    styleUrls: ['./surveys-employee-item-container.component.scss'],
    providers: [
        providePreloader(ProgressBar),
        {
            provide: DialogService,
            useClass: CustomDialogService,
        },
        provideBreadcrumb('TITLE_SURVEYS_MANAGEMENT', 0),
    ],
    standalone: false
})
export class SurveysEmployeeItemContainerComponent implements OnInit {
  app: AppService = inject(AppService);

  screenSize = this.app.storage.screen.data.frontend.size;

  isMobileV = this.screenSize.signal.isMobileV;

  loading$: Observable<boolean>;

  survey: SurveyRequestInterface;

  states: { stateID: string; name: string; color: string; alias: string }[];

  endDate: string;

  constructor(
    private surveysManagementService: SurveysManagementService,
    private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    @Inject(BREADCRUMB) private _: unknown,
  ) {}

  ngOnInit(): void {
    const surveyId = this.route.snapshot.params.id;
    this.getSurvey(surveyId).then(() => {});
  }

  async getSurvey(id: string): Promise<void> {
    const survey = await firstValueFrom(
      this.surveysManagementService.getSurvey(id, 'employee'),
    );
    this.survey = survey.survey;
    this.endDate = moment(this.survey.endDate).format('DD.MM.YYYY');
    this.ref.detectChanges();
  }

  onBackPage(): void {
    this.router.navigate(['/surveys-employee']).then();
  }

  async submitSurvey(survey: SurveyResultRequestInterface) {
    await firstValueFrom(
      this.surveysManagementService.sendSurvey(this.survey.surveyID, survey),
    );
    this.router.navigate(['/surveys-employee']).then();
  }
}
