import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  Input,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { SurveysManagementCreateService } from '@features/surveys-management/sevices/surveys-management-create.service';
import { SurveyFieldInterface } from '@features/surveys-management/models/surveys-management.interface';

@Component({
    selector: 'app-surveys-management-constructor',
    templateUrl: './surveys-management-constructor.component.html',
    styleUrls: ['./surveys-management-constructor.component.scss'],
    standalone: false
})
export class SurveysManagementConstructorComponent {
  @ViewChild('uploader') uploaderRef: ElementRef;

  surveysManagementCreateService: SurveysManagementCreateService = inject(
    SurveysManagementCreateService,
  );

  surveys: WritableSignal<SurveyFieldInterface[]> =
    this.surveysManagementCreateService.surveyFields;

  @Input() showDividerError: boolean;

  constructor(private ref: ChangeDetectorRef) {}

  getTypeLabel(
    type: 'text' | 'select' | 'checkbox' | 'divider' | 'button' | 'file',
  ): string {
    this.ref.markForCheck();
    switch (type) {
      case 'text':
        return 'Текст';
      case 'checkbox':
        return 'Несколько вариантов';
      case 'select':
        return 'Один вариант';
      case 'divider':
        return 'Раздел';
      case 'file':
        return 'Файл';
      default:
        return '';
    }
  }

  getPlaceholderByType(
    type: 'text' | 'select' | 'checkbox' | 'divider' | 'button' | 'file',
  ): string {
    this.ref.markForCheck();
    switch (type) {
      case 'text':
      case 'checkbox':
      case 'select':
        return 'Введите вопрос';
      case 'divider':
        return 'Введите наименование раздела';
      case 'file':
        return 'Введите наименование вопроса';
      default:
        return '';
    }
  }

  addOption(index: number): void {
    const fields: SurveyFieldInterface[] = this.surveys();
    fields[index].options.push({ formulation: '' });
    this.surveys.set(fields);
  }

  removeOption(indexOfQuestion: number, indexOfOption: number): void {
    const fields: SurveyFieldInterface[] = this.surveys();
    fields[indexOfQuestion].options.splice(indexOfOption, 1);
    this.surveys.set(fields);
  }

  removeQuestion(indexOfQuestion: number): void {
    const fields: SurveyFieldInterface[] = this.surveys();
    fields.splice(indexOfQuestion, 1);
    this.surveys.set(fields);
  }

  select(): void {
    this.uploaderRef.nativeElement.click();
  }

  removeFiles(indexOfQuestion: number): void {
    const fields: SurveyFieldInterface[] = this.surveys();
    delete fields[indexOfQuestion].fileData;
    this.surveys.set(fields);

    if (this.uploaderRef?.nativeElement) {
      this.uploaderRef.nativeElement.value = null;
    }
  }

  async onFilesAdd(event: any, indexOfQuestion: number) {
    const file = event.target?.files[0];
    const file64 = (await this.getBase64(file)) as string;
    const fields: SurveyFieldInterface[] = this.surveys();
    fields[indexOfQuestion].fileData = {
      fileName: file.name,
      file64,
    };
    this.surveys.set(fields);
    this.ref.markForCheck();
  }

  private async getBase64(f: Blob | File): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(f);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
}
