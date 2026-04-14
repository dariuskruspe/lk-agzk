import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Environment } from '../../../classes/ennvironment/environment';
import { LangFacade } from '../../../features/lang/facades/lang.facade';
import { LangUtils } from '../../../features/lang/utils/lang.utils';
import {
  ItemListBuilderInterface,
  ListLayoutsInterface,
} from '../models/item-list-builder.interface';
import { LocalStorageService } from '@shared/services/local-storage.service';

@Component({
    selector: 'app-item-list-builder',
    templateUrl: './item-list-builder.component.html',
    styleUrls: ['./item-list-builder.component.scss'],
    standalone: false
})
export class ItemListBuilderComponent implements OnChanges {
  apiUrl = Environment.inv().api;

  state: unknown | null;

  avatarSrc: string | ArrayBuffer;

  @Input() template: ListLayoutsInterface;

  @Input() widthType: 's' | 'm' | 'l';

  @Input() displayedNames: string[];

  @Input() dataList: any;

  @Input() stateList: unknown[] | null;

  @Input() stateId: string | number | null;

  @Input() highlighted = false;

  @Input() dataConfig: ItemListBuilderInterface[];

  @Output() buttonClick = new EventEmitter();

  constructor(
    public langFacade: LangFacade,
    public langUtils: LangUtils,
    private localStorageService: LocalStorageService,
    private ref: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ((typeof this.stateId === 'number' || this.stateId) && this.stateList) {
      this.state =
        this.stateList?.find((e: { id?: string; code?: number }) =>
          e.id ? e.id === this.stateId : e.code === this.stateId,
        ) || null;
    }
    if (changes.dataList?.currentValue) {
      const avatarConfig = this.dataConfig.find(
        (conf) => conf.type === 'avatar',
      );
      if (
        avatarConfig &&
        this.dataList &&
        this.dataList[avatarConfig.name] &&
        !this.isBase64Image(this.dataList[avatarConfig.name])
      ) {
        this.getAvatar(this.dataList[avatarConfig.name]);
      }
    }
  }

  emitEvent() {
    this.buttonClick.emit(this.dataList);
  }

  isBase64Image(image: string): boolean {
    return !image.startsWith('/');
  }

  getAvatar(logo: string) {
    const getBase64Image = async (res) => {
      const blob = await res.blob();

      const reader = new FileReader();

      await new Promise((resolve, reject) => {
        reader.onload = resolve;
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      return reader.result;
    };

    fetch(this.apiUrl + logo, {
      headers: {
        'X-Token': this.localStorageService.getTokens(),
      },
    })
      .then(getBase64Image)
      .then((imgString) => {
        this.avatarSrc = imgString;
        this.ref.detectChanges();
      });
  }

  getColor(color: string): string {
    if (!color) return '';
    return color.startsWith('#') || color.startsWith('var')
      ? color
      : `var(--${color})`;
  }

  protected readonly encodeURI = encodeURI;
}
