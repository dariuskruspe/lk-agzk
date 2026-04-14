import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  SurveyFieldRequestInterface,
  SurveyRequestInterface,
  SurveyResultRequestInterface,
} from '@features/surveys-management/models/surveys-management.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileBase64 } from '@shared/models/files.interface';
import { firstValueFrom } from 'rxjs';
import { SafeResourceUrl } from '@angular/platform-browser';
import { SurveysManagementService } from '@features/surveys-management/sevices/surveys-management.service';
import { FileDownloadService } from '@shared/services/file-download.service';
import { FileSanitizerClass } from '@shared/utilits/download-file.utils';

@Component({
    selector: 'app-surveys-management-preview',
    templateUrl: './surveys-management-preview.component.html',
    styleUrls: ['./surveys-management-preview.component.scss'],
    standalone: false
})
export class SurveysManagementPreviewComponent implements OnInit {
  @Input() hideButtons: boolean;

  @Input() disableForm: boolean = false;

  @Input() questions: SurveyFieldRequestInterface[];

  @Input() setting: SurveyRequestInterface;

  @Output() submitSurvey = new EventEmitter<SurveyResultRequestInterface>();

  @Output() cancelSurvey = new EventEmitter();

  form: FormGroup;

  isDownloadLoadingSignal: WritableSignal<boolean> = signal(false);

  previousFormValue;

  constructor(
    private fb: FormBuilder,
    private surveysManagementService: SurveysManagementService,
    private fileDownloader: FileDownloadService,
    private fileSanitizer: FileSanitizerClass,
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    const group: any = {};
    this.questions.forEach((question) => {
      if (question.required) {
        group[question.questionID] = [
          question.answerType === 'severalOptions' ? [] : question.answer || '',
          [Validators.required],
        ];
      } else {
        group[question.questionID] = [
          question.answerType === 'severalOptions' ? [] : question.answer || '',
        ];
      }
    });
    this.form = this.fb.group(group);
    if (this.disableForm) {
      this.form.disable();
    }
    this.previousFormValue = this.form.value;
  }

  onSubmit() {
    this.markAsTouched(this.form);
    if (this.form.valid) {
      const result: SurveyResultRequestInterface = {
        isDraft: false,
        answers: [],
      };
      this.questions.forEach((question) => {
        if (Array.isArray(this.form.value[question.questionID])) {
          this.form.value[question.questionID].forEach(
            (value: string, index) => {
              result.answers.push({
                questionID: question.questionID,
                elementaryQuestionID: question.elementaryQuestionID,
                answer: value,
                noAnswer:
                  !this.form.value[question.questionID] && !question.required,
                cellNumber: index + 1,
              });
            },
          );
        } else {
          result.answers.push({
            questionID: question.questionID,
            elementaryQuestionID: question.elementaryQuestionID,
            answer: this.form.value[question.questionID],
            noAnswer:
              !this.form.value[question.questionID] && !question.required,
          });
        }
      });
      this.submitSurvey.emit(result);
    }
  }

  markAsTouched(group: FormGroup): void {
    const controls = Array.isArray(group.controls)
      ? group.controls
      : Object.values(group.controls);
    for (const control of controls) {
      control.markAsDirty();
      control.markAsTouched();
      control.updateValueAndValidity();
    }
  }

  cancelSurveyClick(): void {
    this.cancelSurvey.emit();
  }

  replaceLinksWithAnchorTags(inputString: string): string {
    // Используем регулярное выражение для поиска всех ссылок
    const regex = /https?:\/\/[^\s]+/g;

    // Заменяем все ссылки на тег <a>
    return inputString.replace(regex, (url) => {
      return `<a href="${url}" target="_blank">${url}</a>`;
    });
  }

  async downloadFile(file: { fileLink?: string }): Promise<void> {
    if (!file.fileLink) return;
    this.isDownloadLoadingSignal.set(true);
    let downloadingFile: FileBase64;
    try {
      downloadingFile = await firstValueFrom(
        this.surveysManagementService.getDownloadFile(file.fileLink),
      );
    } finally {
      this.isDownloadLoadingSignal.set(false);
    }

    const safeURL: SafeResourceUrl =
      this.fileSanitizer.getSafeResourceURLFromFileBase64Data(
        downloadingFile.file64,
        downloadingFile.fileExtension,
      );
    await this.fileDownloader.download(safeURL, downloadingFile.fileName);
    return;
  }

  setUnchecked(formControlName: string) {
    if (this.previousFormValue[formControlName] === this.form.value[formControlName]) {
      this.form.get(formControlName).reset(undefined);
    }
    this.previousFormValue = this.form.value;
  }
}
