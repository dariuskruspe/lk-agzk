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
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { FeedbackInterface } from '@features/feedback/models/feedback.interface';
import { FeedbackService } from '@features/feedback/sevices/feedback.service';
import {
  SurveyFieldRequestInterface,
  SurveyResultRequestInterface,
} from '@features/surveys-management/models/surveys-management.interface';

@Component({
    selector: 'app-feedback-item-container',
    templateUrl: './feedback-item-container.component.html',
    styleUrls: ['./feedback-item-container.component.scss'],
    providers: [
        providePreloader(ProgressBar),
        {
            provide: DialogService,
            useClass: CustomDialogService,
        },
        provideBreadcrumb('FEEDBACK', 0),
    ],
    standalone: false
})
export class FeedbackItemContainerComponent implements OnInit {
  app: AppService = inject(AppService);

  screenSize = this.app.storage.screen.data.frontend.size;

  isMobileV = this.screenSize.signal.isMobileV;

  loading$ = new BehaviorSubject<boolean>(true);

  feedback: FeedbackInterface;

  stateList: { stateID: string; name: string; color: string; alias: string }[];

  questions: SurveyFieldRequestInterface[];

  constructor(
    private feedbackService: FeedbackService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(BREADCRUMB) private _: unknown,
    private ref: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const feedbackItemId = this.route.snapshot.params.id;
    const { questionnaireID, senderID } = this.route.snapshot.queryParams;
    this.getFeedbackRequest(feedbackItemId, { questionnaireID, senderID }).then(
      () => {
        this.ref.detectChanges();
      },
    );
    this.getStates().then(() => {});
  }

  async getFeedbackRequest(
    id: string,
    data: { questionnaireID: string; senderID: string },
  ): Promise<void> {
    const result = await firstValueFrom(
      this.feedbackService.getFeedbackItemById(id, data),
    );
    this.feedback = result.feedback;
    this.questions = result.feedback.questions.map((question) => {
      return {
        questionType: 'simple',
        answerType: 'text',
        questionID: question.questionID,
        formulation: question.formulation,
        required: question.required,
        section: '',
        answer: question.answer,
      };
    });
    this.loading$.next(false);
  }

  onBackPage(): void {
    this.router.navigate(['/feedback']).then();
  }

  async submit(feedback: SurveyResultRequestInterface): Promise<void> {
    const answers = feedback.answers.map((answer) => {
      return {
        questionID: answer.questionID,
        answer: answer.answer as string,
        noAnswer: answer.noAnswer,
      };
    });
    await firstValueFrom(
      this.feedbackService.patchFeedback(answers, this.feedback.feedbackID),
    );
    this.onBackPage();
  }

  async getStates(): Promise<void> {
    const states = await firstValueFrom(
      this.feedbackService.getFeedbackStates(),
    );
    this.stateList = states.states;
  }

  getState(): { stateID?: string; name: string; color: string; alias: string } {
    return (
      this.stateList?.find(
        (state) => state.stateID === this.feedback.stateID,
      ) || {
        name: '',
        color: '',
        alias: '',
      }
    );
  }

  getColor(color: string): string {
    if (!color) return '';
    return color.startsWith('#') ? color : `var(--${color})`;
  }
}
