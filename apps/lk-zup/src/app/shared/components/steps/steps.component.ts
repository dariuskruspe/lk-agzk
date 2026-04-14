import {
  NgClass,
  NgForOf,
  NgIf,
  NgStyle,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
  NgTemplateOutlet,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
  WritableSignal,
  signal,
} from '@angular/core';
import { LangModule } from '@shared/features/lang/lang.module';
import { StepsOptionsInterface } from '@shared/interfaces/steps/options/steps-options.interface';
import { StepInterface } from '@shared/interfaces/steps/step.interface';
import { TrustedHtmlModule } from '@shared/pipes/security/trusted-html.module';
import { StepsHelperService } from '@shared/services/steps/steps-helper.service';
import { logError } from '@shared/utilits/logger';
import { configBuilder } from '@shared/utils/object/common';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TimelineModule } from 'primeng/timeline';
import { TooltipModule } from 'primeng/tooltip';

type HighlightStepCondition =
  | 'active'
  | 'active prev'
  | 'active next'
  | 'before active'
  | 'after active'
  | 'active or before'
  | 'active or after';

@Component({
    selector: 'app-steps',
    templateUrl: './steps.component.html',
    styleUrls: ['./steps.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        DividerModule,
        LangModule,
        NgClass,
        NgForOf,
        NgIf,
        NgTemplateOutlet,
        TooltipModule,
        TrustedHtmlModule,
        NgSwitch,
        NgSwitchCase,
        NgSwitchDefault,
        NgStyle,
        TimelineModule,
        CardModule,
    ],
    providers: [StepsHelperService]
})
export class StepsComponent implements OnChanges, OnInit {
  @Input() steps: StepInterface[] = [];

  @Input() options: StepsOptionsInterface = {};

  /**
   * Дефолтная (по умолчанию) конфигурация параметров отображения шагов.
   */
  defaultOptions: StepsOptionsInterface = {};

  /**
   * Сигнал, содержащий значение true или false в зависимости от того, подтянулись ли из дефолтного конфига
   * отсутствующие в переданном объекте options параметры.
   */
  optionsBuilt: WritableSignal<boolean> = signal(false);

  /**
   * Условие, по которому шаг будет считаться подсвеченным (к нему будет применяться CSS-класс 'highlight').
   *
   * Используется в качестве аргумента для метода isStep, служащим для проверки того, соответствует ли переданный шаг
   * заданному условию.
   */
  highlightStepCondition: HighlightStepCondition = 'before active'; // по умолчанию подсвечиваем все шаги перед активным, то есть те, которые уже выполнены

  /**
   * То же, что и highlightStepCondition, но для линии между соседними шагами.
   */
  highlightStepDividerCondition: HighlightStepCondition = 'before active';

  @Output() progressCircleClicked: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    // PrimeNG
    @Optional() private dialogConfig: DynamicDialogConfig,
    @Optional() private dialogRef: DynamicDialogRef,

    // other
    protected helper: StepsHelperService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.options?.currentValue) {
      this.initOptions();
      this.initSteps();
    }

    if (changes.steps) {
      if (changes.steps?.currentValue) {
        this.initSteps();
      }
    }
  }

  ngOnInit(): void {
    if (this.dialogConfig?.data?.steps?.length) {
      this.initOptions('dialog');
      this.initSteps('dialog');
    }
  }

  initOptions(mode: 'dialog' | 'default' = 'default'): void {
    const options: StepsOptionsInterface =
      mode === 'dialog' ? this.dialogConfig?.data?.options : this.options;

    this.options =
      options && Object.keys(options).length
        ? options
        : this.helper.initialOptions();

    this.defaultOptions = this.helper.getDefaultOptionsByConfig(this.options);
  }

  initSteps(mode: 'dialog' | 'default' = 'default'): void {
    if (!this.options || !Object.keys(this.options).length) this.initOptions();

    const steps: StepInterface[] =
      mode === 'dialog' ? this.dialogConfig?.data?.steps || [] : this.steps;

    if (!steps?.length) return;
    try {
      // test
      // const options: StepsOptionsInterface = { ...this.defaultOptions };
      // _.merge(options, this.options);
      // this.options = options;

      configBuilder(this.options, this.defaultOptions);
      this.optionsBuilt.set(true);
      this.stepsHandler(steps);
    } catch (e) {
      logError(e, '[app-steps] initSteps -> error:');
    }
  }

  /**
   * Проверяем, соответствует ли переданный шаг заданному условию.
   * @param step шаг
   * @param condition условие
   */
  isStep(step: StepInterface, condition: HighlightStepCondition, currentIndex): boolean {
    if (!this.steps?.length) return false;

    const activeIndex: number = this.getActiveStepIndex();

    switch (condition) {
      case 'active':
        return currentIndex === activeIndex;
      case 'active prev':
        return currentIndex === activeIndex - 1;
      case 'active next':
        return currentIndex === activeIndex + 1;
      case 'before active':
        return currentIndex < activeIndex;
      case 'active or before':
        return currentIndex <= activeIndex;
      case 'after active':
        return currentIndex > activeIndex;
      case 'active or after':
        return currentIndex >= activeIndex;
      default:
        return false;
    }
  }

  /**
   * Получаем индекс переданного шага.
   * @param step шаг
   */
  getStepIndex(step: StepInterface): number {
    if (!step) return -1;
    return this.steps.findIndex((s) => s.id === step.id);
  }

  /**
   * Получаем индекс активного шага.
   * @param step шаг
   */
  getActiveStepIndex(): number {
    return this.steps.findIndex((s) => s.active);
  }

  /**
   * Обработчик шагов (вносим необходимые изменения в шаги перед тем, как допустить их отображение на фронте).
   * @param steps шаги
   * @private
   */
  private stepsHandler(steps: StepInterface[] = []) {
    const { options } = this;
    const { currentTemplate } = options;

    // Вспомогательная функция, добавляющая префикс CSS-класса иконки
    const prefixer = (icon: string): string => {
      if (icon?.startsWith('pi-')) {
        return `pi ${icon}`;
      } else if (icon?.startsWith('mdi-')) {
        return `mdi ${icon}`;
      }
      return icon;
    };

    // Вспомогательная функция, позволяющая добавлять собственные иконки в зависимости от названия CSS-класса,
    // содержащегося в параметре 'icon'
    const iconReplacer = (step: StepInterface): void => {
      // Цвет иконки для обычного (не являющимся ни активным, ни подсвеченным) шага
      const color =
        options.template[currentTemplate].step.marker.icon.style.color;

      // Цвет иконки для активного шага (с CSS-классом 'active')
      const colorA: string =
        options.template[currentTemplate].stepA.marker.icon.style.color;

      // Цвет иконки для подсвеченного шага (с CSS-классом 'highlight')
      const colorH: string =
        options.template[currentTemplate].stepH.marker.icon.style.color;

      // Добавляем иконку подписи
      if (['pi-signature', 'pi pi-signature'].includes(step.icon)) {
        // Иконка для обычного (не являющимся ни активным, ни подсвеченным) шага
        const customIcon = `<svg viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
          <path id="sign" d="M10.83 12.2842C12.3484 11.1474 13.5341 9.9 14.3869 8.54211C15.2397 7.18421 15.6661 5.83158 15.6661 4.48421C15.6661 3.81053 15.5569 3.31579 15.3385 3C15.1201 2.68421 14.8237 2.52632 14.4493 2.52632C13.4717 2.52632 12.6084 3.36316 11.8596 5.03684C11.1108 6.71053 10.7364 8.6 10.7364 10.7053C10.7364 11 10.7415 11.2789 10.752 11.5421C10.7624 11.8053 10.7884 12.0526 10.83 12.2842ZM6.9922 24V21.4737H9.4883V24H6.9922ZM11.9844 24V21.4737H14.4805V24H11.9844ZM16.9766 24V21.4737H19.4727V24H16.9766ZM12.546 17.6842C11.922 17.6842 11.35 17.5632 10.83 17.3211C10.3099 17.0789 9.86271 16.6842 9.4883 16.1368C8.96828 16.4316 8.43266 16.6947 7.88144 16.9263C7.33021 17.1579 6.76339 17.3895 6.18097 17.6211L5.30733 15.2526C5.88976 15.0421 6.44618 14.8158 6.9766 14.5737C7.50702 14.3316 8.02184 14.0737 8.52106 13.8C8.41706 13.3368 8.33905 12.8316 8.28705 12.2842C8.23505 11.7368 8.20905 11.1474 8.20905 10.5158C8.20905 7.48421 8.80187 4.97368 9.98752 2.98421C11.1732 0.994737 12.6604 0 14.4493 0C15.5309 0 16.415 0.405263 17.1014 1.21579C17.7878 2.02632 18.131 3.15789 18.131 4.61053C18.131 6.42105 17.5642 8.21053 16.4306 9.97895C15.2969 11.7474 13.7213 13.3368 11.7036 14.7474C11.8492 14.8947 12 15.0053 12.156 15.0789C12.312 15.1526 12.4732 15.1895 12.6396 15.1895C13.1804 15.1895 13.8097 14.8421 14.5273 14.1474C15.2449 13.4526 15.895 12.5368 16.4774 11.4L18.7551 12.4737C18.6095 12.8316 18.4951 13.2632 18.4119 13.7684C18.3287 14.2737 18.3391 14.7158 18.4431 15.0947C18.6511 14.9895 18.8955 14.8105 19.1763 14.5579C19.4571 14.3053 19.7431 13.9895 20.0343 13.6105L22 15.1579C21.4592 15.9158 20.8352 16.5263 20.1279 16.9895C19.4207 17.4526 18.7655 17.6842 18.1622 17.6842C17.7254 17.6842 17.3354 17.5526 16.9922 17.2895C16.649 17.0263 16.363 16.6211 16.1342 16.0737C15.5517 16.6 14.9589 17 14.3557 17.2737C13.7525 17.5474 13.1492 17.6842 12.546 17.6842Z"/>
        </svg>`;

        step.customIcon = customIcon;

        // Иконка для активного шага (парсим svg из строки, чтобы заменить цвет заливки пути у svg)
        const parser = new DOMParser();
        const doc = parser.parseFromString(customIcon, 'image/svg+xml');
        const parsedSVG = doc.documentElement as unknown as SVGSVGElement;
        // const svgSignPath = parsedSVG.getElementById('sign');
        // svgSignPath.setAttribute('fill', colorA);
        parsedSVG.setAttribute('fill', colorA);

        // перегоняем svg обратно в строку
        const xmlSerializer = new XMLSerializer();
        step.customIconA = xmlSerializer.serializeToString(parsedSVG);

        // Иконка для подсвеченного шага
        parsedSVG.setAttribute('fill', colorH);
        step.customIconH = xmlSerializer.serializeToString(parsedSVG);
      }
    };

    // Обрабатываем шаги вышеуказанными вспомогательными функциями
    this.steps = steps.map((s, index) => {
      const step = {
        ...s,
        icon: prefixer(s.icon),
        iconA: prefixer(s.iconA),
      };

      // test
      // if (index === 1) step.icon = 'pi-signature';
      // if (index === 1) step.active = false;
      // if (index === 2) step.active = true;

      iconReplacer(step);

      return step;
    });
  }
}
