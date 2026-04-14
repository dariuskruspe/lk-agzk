import {
  ChangeDetectorRef,
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { NewsletterService } from '../../services/newsletter.service';
import {
  NewsletterCreateRequestInterface,
  NewsletterInterface,
} from '../../models/newsletter.interface';
import { MessageTemplateInterface } from '../../models/message-template.interface';
import { AppService } from '@shared/services/app.service';
import { OptionListSurveyInterface } from '@app/features/surveys-management/models/surveys-management.interface';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageTemplateCreateContainerComponent } from '../message-template-create-container/message-template-create-container.component';
import { TranslatePipe } from '@app/shared/features/lang/pipes/lang.pipe';
import * as XLSX from 'xlsx';
import { MenuItem, MessageService } from 'primeng/api';

@Component({
  selector: 'app-newsletter-create-container',
  templateUrl: './newsletter-create-container.component.html',
  styleUrls: ['./newsletter-create-container.component.scss'],
  standalone: false,
})
export class NewsletterCreateContainerComponent implements OnInit {
  app: AppService = inject(AppService);
  private readonly messageService = inject(MessageService);

  screenSize = this.app.storage.screen.data.frontend.size;
  isMobileV = this.screenSize.signal.isMobileV;

  newsletterForm: FormGroup;
  selectedTemplate: MessageTemplateInterface | null = null;

  isSubmitting = false;

  recipientsOptionList: OptionListSurveyInterface;
  recipientsOptionListResponse: OptionListSurveyInterface;
  templatesOptionList: MessageTemplateInterface[];

  newsletterId: string;

  currentDate = new Date();

  private dialogRef: DynamicDialogRef;

  resipientsFile: WritableSignal<{
    fileName: string;
    file64: string | ArrayBuffer;
    found: { userId: string; fullName: string }[];
    notFound: { userId: string; errorReason: string }[];
  } | null> = signal(null);

  constructor(
    private fb: FormBuilder,
    private newsletterService: NewsletterService,
    private router: Router,
    private dialogService: DialogService,
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private translatePipe: TranslatePipe,
  ) {
    this.newsletterForm = this.createForm();
  }

  async onRecipientsFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    const file64 = await this.getBase64(file);
    await this.onChangeFile({ fileName: file.name, file64 });
    // очистим input, чтобы повторный выбор того же файла тоже триггерил change
    input.value = '';
  }

  private getBase64(f: Blob | File): Promise<string | ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(f);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  private loadCopyData(): void {
    const copyData = localStorage.getItem('newsletterCopyData');
    if (copyData) {
      try {
        const data = JSON.parse(copyData);

        // Заполняем форму данными из localStorage
        this.newsletterForm.patchValue({
          newsletterName: data.newsletterName,
          description: data.description,
          startDate: data.startDate ? new Date(data.startDate) : null,
          endDate: data.endDate ? new Date(data.endDate) : null,
          recipients: data.recipients || [],
          templateId: data.templateId,
          smsTemplate: data.smsTemplate,
        });

        // Загружаем шаблон, если он указан
        if (data.templateId) {
          this.onTemplateChange(data.templateId);
        }

        // Очищаем данные из localStorage после использования
        localStorage.removeItem('newsletterCopyData');

        this.changeDetectorRef.detectChanges();
      } catch (error) {
        console.error('Ошибка при загрузке данных копирования:', error);
        localStorage.removeItem('newsletterCopyData');
      }
    }
  }

  ngOnInit(): void {
    const newsletterId = this.route.snapshot.paramMap.get('id');
    if (newsletterId) {
      this.newsletterId = newsletterId;
      this.getNewsletter(newsletterId);
    } else {
      // Проверяем, есть ли данные для копирования в localStorage
      this.loadCopyData();
    }
    this.getOptionLists();
  }

  async getNewsletter(id: string) {
    const newsletter = (
      await firstValueFrom(this.newsletterService.getNewsletter(id))
    ).pop();
    this.newsletterForm
      .get('newsletterName')
      ?.setValue(newsletter.newsletterName);
    this.newsletterForm.get('description')?.setValue(newsletter.description);
    this.newsletterForm
      .get('startDate')
      ?.setValue(new Date(newsletter.startDate));
    this.newsletterForm.get('endDate')?.setValue(new Date(newsletter.endDate));
    this.newsletterForm
      .get('recipients')
      ?.setValue(newsletter.recipients.map((recipient) => recipient.userId));
    this.newsletterForm.get('smsTemplate')?.setValue(newsletter.smsTemplate);
    this.newsletterForm.get('templateId')?.setValue(newsletter.templateId);
    this.onTemplateChange(newsletter.templateId);
    this.changeDetectorRef.detectChanges();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      newsletterName: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', [Validators.maxLength(1000)]],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      recipients: [[], [Validators.required]],
      templateId: [null, [Validators.required]],
      smsTemplate: [''],
    });
  }

  async onTemplateChange(templateId: string): Promise<void> {
    const template = (
      await firstValueFrom(this.newsletterService.getTemplate(templateId))
    ).pop();
    this.selectedTemplate = template || null;
    this.changeDetectorRef.detectChanges();
  }

  async onSubmit(): Promise<void> {
    if (this.newsletterForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      try {
        const formValue = this.newsletterForm.value;

        const recipients = formValue.recipients.map((recipient) => ({
          userID: recipient,
        }));

        const newsletterData: NewsletterCreateRequestInterface = {
          newsletterName: formValue.newsletterName,
          description: formValue.description,
          startDate: formValue.startDate,
          endDate: formValue.endDate,
          recipients,
          templateId: formValue.templateId,
          smsTemplate: formValue.smsTemplate || undefined,
          status: 'Ожидание',
        };

        let res: NewsletterInterface;
        if (this.newsletterId) {
          newsletterData.newsletterId = this.newsletterId;
          res = await firstValueFrom(
            this.newsletterService.updateNewsletter(newsletterData),
          );
          this.router.navigate([
            `/newsletter-management/view/${this.newsletterId}`,
          ]);
        } else {
          res = await firstValueFrom(
            this.newsletterService.createNewsletter(newsletterData),
          );
          this.router.navigate([
            `/newsletter-management/view/${res.newsletterId}`,
          ]);
        }
      } catch (error) {
        console.error('Error creating newsletter:', error);
      } finally {
        this.isSubmitting = false;
      }
    }
  }

  async onSaveDraft(): Promise<void> {
    if (!this.isSubmitting) {
      this.isSubmitting = true;

      try {
        const formValue = this.newsletterForm.value;

        const recipients = formValue.recipients.map((recipient) => ({
          userID: recipient,
        }));

        const newsletterData: NewsletterCreateRequestInterface = {
          newsletterName: formValue.newsletterName,
          description: formValue.description,
          startDate: formValue.startDate,
          endDate: formValue.endDate,
          recipients,
          templateId: formValue.templateId,
          smsTemplate: formValue.smsTemplate || undefined,
          status: 'Черновик',
        };

        await firstValueFrom(
          this.newsletterService.createNewsletter(newsletterData),
        );
        this.router.navigate(['/newsletter-management']);
      } catch (error) {
        console.error('Error saving draft:', error);
      } finally {
        this.isSubmitting = false;
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/newsletter-management']);
  }

  onCreateTemplate(): void {
    this.dialogRef = this.dialogService.open(
      MessageTemplateCreateContainerComponent,
      {
        header: this.translatePipe.transform('NEWSLETTER_TEMPLATE_CREATION'),
        modal: true,
        closable: true,
        data: {
          isDialog: true,
        },
      },
    );

    this.dialogRef.onClose.subscribe((templateId: string) => {
      if (templateId) {
        this.getTemplatesList().then(() => {
          this.newsletterForm.get('templateId')?.setValue(templateId);
          this.onTemplateChange(templateId);
        });
      }
      this.dialogRef = undefined;
    });
  }

  getOptionLists() {
    this.getRecipientsList().then(() => {});
    this.getTemplatesList().then(() => {});
  }

  async getRecipientsList() {
    this.recipientsOptionListResponse = await firstValueFrom(
      this.newsletterService.getOptions('newsletterRecipient'),
    );
    this.recipientsOptionList = { ...this.recipientsOptionListResponse };
    this.changeDetectorRef.detectChanges();
  }

  async getTemplatesList() {
    const res = await firstValueFrom(this.newsletterService.getTemplates());
    this.templatesOptionList = res.templateList;
  }

  downloadXLSXTemplate() {
    const data = [['ID(SOEID/GEID)'], ['']];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Recipients');
    const fileName = 'newsletter_recipients_template.xlsx';
    XLSX.writeFile(wb, fileName);
  }

  downloadXLSXNotFound() {
    const data = [
      ['GEID', 'Причина ошибки'],
      ...this.resipientsFile().notFound.map((recipient) => [
        recipient.userId,
        recipient.errorReason,
      ]),
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Recipients');
    const fileName = 'newsletter_recipients_not_found.xlsx';
    XLSX.writeFile(wb, fileName);
  }

  async onChangeFile(file?: {
    fileName: string;
    file64: string | ArrayBuffer;
  }) {
    if (!file) {
      this.resipientsFile.set(null);
      return;
    }
    const fileRes = await firstValueFrom(
      this.newsletterService.getRecipientsFile(file.file64),
    );
    this.resipientsFile.set({
      fileName: file.fileName,
      file64: file.file64,
      found: fileRes.found,
      notFound: fileRes.notFound,
    });
    const ids = fileRes.found.map((recipient) => {
      if (
        !this.recipientsOptionList.optionList.find(
          (option) => option.value === recipient.userId,
        )
      ) {
        this.recipientsOptionList.optionList.push({
          representation: recipient.fullName,
          value: recipient.userId,
        });
      }
      return recipient.userId;
    });
    this.newsletterForm?.get('recipients')?.setValue(ids);
    this.messageService.add({
      severity: fileRes.notFound.length
        ? fileRes.found.length
          ? 'warn'
          : 'error'
        : 'success',
      summary: 'Файл загружен',
      detail: `Загружено получателей: ${fileRes.found.length}. Не удалось сопоставить: ${fileRes.notFound.length}`,
    });
  }
}
