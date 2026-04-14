import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Languages } from '@features/main/constants/languages';
import { Themes } from '@features/main/constants/themes';
import { LangFacade } from '@shared/features/lang/facades/lang.facade';
import { LangUtils } from '@shared/features/lang/utils/lang.utils';
import { SettingsInterface } from '@shared/features/settings/models/settings.interface';
import { AppService } from '@shared/services/app.service';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-auth-header.component.html',
  styleUrls: ['./main-auth-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class MainAuthHeaderComponent implements OnChanges {
  app: AppService = inject(AppService);

  screenSizeData = this.app.storage.screen.data.frontend.size;

  isMobileV = this.screenSizeData.signal.isMobileV;

  @Input() settings: SettingsInterface;

  @Input() isQuitPossible: boolean;

  @Output() changeLang = new EventEmitter();

  @Output() themeChange = new EventEmitter<string>();

  @Output() quit = new EventEmitter<void>();

  languages = Languages.slice(0, 6);

  themes = Themes;

  openLanguages = false;

  openTheme = false;

  constructor(
    public langFacade: LangFacade,
    public langUtils: LangUtils,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes?.settings?.currentValue &&
      changes?.settings?.currentValue?.general?.languages
    ) {
      this.languages = Languages.filter((lang) =>
        this.settings.general?.languages?.includes(lang.value),
      );
    }
  }

  onChangeLang(lang: { value: string }): void {
    this.changeLang.emit(lang.value);
    this.toggleMenu('');
  }

  onChangeTheme(theme: { value: string }): void {
    this.themeChange.emit(theme.value);
    this.toggleMenu('');
  }

  onQuit() {
    this.quit.emit();
  }

  toggleMenu(item: string) {
    switch (item) {
      case 'openLanguages':
        this.openLanguages = !this.openLanguages;
        this.openTheme = false;
        break;
      case 'openTheme':
        this.openTheme = !this.openTheme;
        this.openLanguages = false;
        break;
      default:
        this.openTheme = false;
        this.openLanguages = false;
        break;
    }
  }
}
