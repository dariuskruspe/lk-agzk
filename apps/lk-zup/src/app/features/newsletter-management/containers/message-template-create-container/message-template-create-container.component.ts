import { Component, OnInit, inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MessageTemplateService } from '../../services/message-template.service';
import { MessageTemplateCreateRequestInterface } from '../../models/message-template.interface';
import { AppService } from '@shared/services/app.service';
import { MessageService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { TemplateSaveConfirmationDialogComponent } from '../../components/template-save-confirmation-dialog/template-save-confirmation-dialog.component';
import { TranslatePipe } from '@app/shared/features/lang/pipes/lang.pipe';

@Component({
  selector: 'app-message-template-create-container',
  templateUrl: './message-template-create-container.component.html',
  styleUrls: ['./message-template-create-container.component.scss'],
  standalone: false,
})
export class MessageTemplateCreateContainerComponent implements OnInit {
  app: AppService = inject(AppService);
  private readonly messageService = inject(MessageService);

  screenSize = this.app.storage.screen.data.frontend.size;
  isMobileV = this.screenSize.signal.isMobileV;

  templateId: string | null = null;

  templateForm: FormGroup;
  isLoading = false;
  showPreview = false;

  isDialog = false;

  constructor(
    private fb: FormBuilder,
    private messageTemplateService: MessageTemplateService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    @Optional() private config: DynamicDialogConfig,
    @Optional() private dialogRef: DynamicDialogRef,
    private translatePipe: TranslatePipe,
  ) {
    this.templateForm = this.createForm();
  }

  ngOnInit(): void {
    this.isDialog = this.config?.data?.isDialog || false;
    const templateId = this.route.snapshot.paramMap.get('id');
    if (templateId && !this.isDialog) {
      this.templateId = templateId;
      this.loadTemplate();
    } else if (!this.isDialog) {
      // Проверяем, есть ли данные для копирования в localStorage
      this.loadCopyData();
    }
  }

  async loadTemplate(): Promise<void> {
    const template = (
      await firstValueFrom(
        this.messageTemplateService.getTemplate(this.templateId),
      )
    ).pop();
    this.templateForm.get('templateName')?.setValue(template.templateName);
    this.templateForm
      .get('newsletterTemplate')
      ?.setValue(template.newsletterTemplate);
  }

  private createForm(): FormGroup {
    return this.fb.group({
      templateName: ['', [Validators.required, Validators.maxLength(255)]],
      newsletterTemplate: ['', [Validators.required]],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.templateForm.valid && !this.isLoading) {
      this.isLoading = true;

      try {
        const formValue = this.templateForm.value;

        const templateData: MessageTemplateCreateRequestInterface = {
          templateName: formValue.templateName,
          newsletterTemplate: formValue.newsletterTemplate
            .toString()
            .startsWith('<html>')
            ? formValue.newsletterTemplate
            : '<html>' + formValue.newsletterTemplate + '</html>',
          collectConfirmations: formValue.newsletterTemplate.includes(
            'class="confirm-button"',
          ),
        };

        if (this.templateId) {
          templateData.templateId = this.templateId;
          // перезапрашиваем шаблон
          const currentTemplate = (
            await firstValueFrom(
              this.messageTemplateService.getTemplate(this.templateId),
            )
          ).pop();

          // если используется в активных рассылках, то открываем диалог подтверждения
          if (currentTemplate.useInActiveNewsletters) {
            this.dialogRef = this.dialogService.open(
              TemplateSaveConfirmationDialogComponent,
              {
                header: 'Подтверждение',
                width: '450px',
                modal: true,
                closable: true,
                data: {},
              },
            );

            this.dialogRef.onClose.subscribe(async (confirmed: boolean) => {
              if (confirmed) {
                await this.updateTemplate(
                  templateData as MessageTemplateCreateRequestInterface,
                );
              }
              this.dialogRef = undefined;
            });
          } else {
            await this.updateTemplate(
              templateData as MessageTemplateCreateRequestInterface,
            );
          }
        } else {
          if (this.isDialog) {
            const result = await firstValueFrom(
              this.messageTemplateService.createTemplate(templateData),
            );
            this.dialogRef?.close(result.templateId);
          } else {
            await firstValueFrom(
              this.messageTemplateService.createTemplate(templateData),
            );
            this.router.navigate(['/newsletter-management/templates']);
          }
        }
      } catch (error) {
        console.error('Error creating template:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }

  async updateTemplate(
    templateData: MessageTemplateCreateRequestInterface,
  ): Promise<void> {
    const result = await firstValueFrom(
      this.messageTemplateService.updateTemplate(templateData),
    );
    this.messageService.add({
      severity: result.success ? 'success' : 'error',
      summary: result.success
        ? this.translatePipe.transform('NEWSLETTER_SUCCESS')
        : this.translatePipe.transform('NEWSLETTER_ERROR'),
      detail: result.success
        ? this.translatePipe.transform('NEWSLETTER_TEMPLATE_SAVED')
        : this.translatePipe.transform('NEWSLETTER_TEMPLATE_SAVE_ERROR'),
    });
  }

  onCancel(): void {
    this.router.navigate(['/newsletter-management/templates']);
  }

  addConfirmationButton(): void {
    const currentContent =
      this.templateForm.get('newsletterTemplate')?.value || '';
    const confirmationButton = `
    <div style="text-align: center; margin: 20px 0;">
    <a style="background-color: #007bff;color: white;border: none;padding: 12px 24px;border-radius: 6px;font-size: 16px;font-weight: 500;cursor: pointer;text-decoration: none;display: inline-block;" href="[#Рассылки уведомлений (ЛКС).Кнопка «Подтвердить»#]" class="confirm-button">
    Подтвердить
    </a>
    </div>`;

    const newContent = currentContent + confirmationButton;
    this.templateForm.get('newsletterTemplate')?.setValue(newContent);
  }

  async onDelete(): Promise<void> {
    await firstValueFrom(
      this.messageTemplateService.deleteTemplate(this.templateId),
    );
    this.router.navigate(['/newsletter-management/templates']);
  }

  onCopy(): void {
    if (!this.templateId) return;

    // Получаем текущие данные формы
    const formValue = this.templateForm.value;

    // Подготавливаем данные для копирования
    const copyData = {
      newsletterTemplate: formValue.newsletterTemplate,
    };

    // Сохраняем в localStorage
    localStorage.setItem('templateCopyData', JSON.stringify(copyData));

    // Перенаправляем на страницу создания шаблона
    this.router.navigate(['/newsletter-management/templates/create']);
  }

  private loadCopyData(): void {
    const copyData = localStorage.getItem('templateCopyData');
    if (copyData) {
      try {
        const data = JSON.parse(copyData);

        // Заполняем форму данными из localStorage
        this.templateForm.patchValue({
          newsletterTemplate: data.newsletterTemplate,
        });

        // Очищаем данные из localStorage после использования
        localStorage.removeItem('templateCopyData');
      } catch (error) {
        console.error('Ошибка при загрузке данных копирования шаблона:', error);
        localStorage.removeItem('templateCopyData');
      }
    }
  }

  // openConfirmationDialog(): void {
  //   this.dialogRef = this.dialogService.open(
  //     TemplateSaveConfirmationDialogComponent,
  //     {
  //       header: '',
  //       width: '450px',
  //       modal: true,
  //       closable: true,
  //       data: {},
  //     },
  //   );

  //   this.dialogRef.onClose.subscribe((confirmed: boolean) => {
  //     if (confirmed) {
  //       this.pendingSaveData = null;
  //     } else {
  //       this.pendingSaveData = null;
  //     }
  //     this.dialogRef = undefined;
  //   });
  // }
}
