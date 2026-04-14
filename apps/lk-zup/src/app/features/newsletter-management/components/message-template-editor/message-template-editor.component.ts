import { CommonModule } from '@angular/common';
import {
  Component,
  forwardRef,
  signal,
  input,
  output,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule,
} from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-message-template-editor',
  imports: [CommonModule, FormsModule],
  templateUrl: './message-template-editor.component.html',
  styleUrl: './message-template-editor.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MessageTemplateEditorComponent),
      multi: true,
    },
  ],
  standalone: true,
})
export class MessageTemplateEditorComponent
  implements ControlValueAccessor, OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;

  private platformId = inject(PLATFORM_ID);

  readOnly = input<boolean>(false);
  placeholder = input<string>('Введите HTML содержимое шаблона...');
  onInit = output<any>();

  private onChange: any = () => {};
  private onTouch: any = () => {};

  protected value = signal('');
  protected disabled = signal(false);
  protected isLoading = signal(true);

  private editorInstance: any;
  private hugerteLoaded = false;

  ngOnInit() {}

  async ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      await this.loadHugeRTE();
      await this.initEditor();
    }
  }

  ngOnDestroy() {
    this.destroyEditor();
  }

  private async loadHugeRTE(): Promise<void> {
    if (this.hugerteLoaded) {
      return;
    }

    try {
      // Динамически загружаем HugeRTE
      const hugerte = await import('hugerte');

      // Загружаем необходимые компоненты
      await import('hugerte/models/dom');
      await import('hugerte/themes/silver');
      await import('hugerte/icons/default');
      // Загружаем русскую локализацию
      try {
        await import('@assets/hugerte/langs/ru.js');
      } catch (error) {
        console.warn(
          'Русская локализация hugerte не найдена, используем английский',
        );
      }

      // Загружаем скины
      await import('hugerte/skins/ui/oxide/skin.js');
      await import('hugerte/skins/ui/oxide/content.js');
      await import('hugerte/skins/content/default/content.js');

      // Плагины
      await import('hugerte/plugins/advlist');
      await import('hugerte/plugins/autolink');
      await import('hugerte/plugins/lists');
      await import('hugerte/plugins/link');
      await import('hugerte/plugins/image');
      await import('hugerte/plugins/charmap');
      await import('hugerte/plugins/preview');
      await import('hugerte/plugins/anchor');
      await import('hugerte/plugins/searchreplace');
      await import('hugerte/plugins/visualblocks');
      await import('hugerte/plugins/code');
      await import('hugerte/plugins/fullscreen');
      await import('hugerte/plugins/insertdatetime');
      await import('hugerte/plugins/media');
      await import('hugerte/plugins/table');
      await import('hugerte/plugins/help');
      await import('hugerte/plugins/wordcount');

      this.hugerteLoaded = true;
    } catch (error) {
      console.error('Ошибка загрузки HugeRTE:', error);
      throw error;
    }
  }

  private async initEditor(): Promise<void> {
    const { default: hugerte } = await import('hugerte');

    const config = {
      target: this.editorContainer.nativeElement,
      height: 400,
      skin_url: 'default',
      content_css: 'default',
      menubar: false,
      language: 'ru',
      language_url: '/assets/hugerte/langs/ru.js',
      plugins: [
        'advlist',
        'autolink',
        'lists',
        'link',
        'image',
        'charmap',
        'anchor',
        'searchreplace',
        'visualblocks',
        'code',
        'fullscreen',
        'insertdatetime',
        'media',
        'table',
        'help',
        'wordcount',
      ],
      toolbar: [
        'undo redo | blocks | bold italic underline strikethrough | fontfamily fontsize',
        'forecolor backcolor | alignleft aligncenter alignright alignjustify | outdent indent',
        'numlist bullist | link media table | code fullscreen | help',
      ],
      toolbar_mode: 'sliding',
      contextmenu: 'link image table',
      content_style:
        'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
      readonly: this.readOnly() || this.disabled(),
      placeholder: this.placeholder(),
      paste_data_images: true,
      image_uploadtab: false,
      setup: (editor: any) => {
        editor.on('init', () => {
          this.isLoading.set(false);
          this.onInit.emit(editor);

          // Устанавливаем начальное значение
          if (this.value()) {
            editor.setContent(this.value());
          }
        });

        editor.on('Change KeyUp', () => {
          const content = editor.getContent();
          this.onModelChange(content);
        });
      },
    };

    try {
      this.editorInstance = await hugerte.init(config as any);
    } catch (error) {
      console.error('Ошибка инициализации HugeRTE:', error);
      this.isLoading.set(false);
    }
  }

  private destroyEditor(): void {
    if (this.editorInstance && this.editorInstance.length > 0) {
      this.editorInstance[0].destroy();
    }
  }

  writeValue(value: string): void {
    this.value.set(value || '');

    // Если редактор уже инициализирован, обновляем содержимое
    if (this.editorInstance && this.editorInstance.length > 0) {
      this.editorInstance[0].setContent(value || '');
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);

    // Если редактор уже инициализирован, обновляем состояние
    if (this.editorInstance && this.editorInstance.length > 0) {
      this.editorInstance[0].mode.set(isDisabled ? 'readonly' : 'design');
    }
  }

  onModelChange(value: string): void {
    this.value.set(value);
    this.onChange(value);
    this.onTouch();
  }
}
