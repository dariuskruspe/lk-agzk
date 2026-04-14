import { Component, input, model, ModelSignal, OnInit } from '@angular/core';
import { ItemListInterface } from '../../../../components/item-list/models/item-list.interface';
import { isNil } from '../../../../utilits/is-nil.util';
import { ProviderUserDataInterface } from '../../../signature-validation-form/models/providers.interface';
import { AbstractCreationComponent } from '../abstract-creation/abstract-creation.component';

@Component({
    selector: 'app-external-creation',
    templateUrl: './external-creation.component.html',
    styleUrls: ['./external-creation.component.scss'],
    standalone: false
})
export class ExternalCreationComponent
  extends AbstractCreationComponent
  implements OnInit
{
  personalData: ModelSignal<ItemListInterface[]> = model([]);

  disabledButton = false;

  // фиктивная отправка ЭЦП (кнопка "Отправить" меняется на "Далее" и используется для перехода к следующему шагу)
  dummy = input(false);

  // сообщаем внешнему компоненту о нажатии кнопки "Далее"
  nextStepClickedSignal: ModelSignal<boolean> = model(false);

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.onChanged();
  }

  onChanged(): void {
    this.personalData.set(this.convertObjToListItem(this.provider.ui.userData));
  }

  private convertObjToListItem(
    obj: ProviderUserDataInterface[]
  ): ItemListInterface[] {
    return (
      obj?.reduce((acc, item) => {
        if (isNil(item?.value) || item?.value?.trim?.() === '') {
          this.disabledButton = true;
        }
        if (item?.title) {
          if (typeof item?.value === 'object') {
            acc.push({
              title: item?.title,
              items: this.convertObjToListItem(item?.value),
            });
          } else {
            acc.push({
              title: item?.title,
              value: item?.value,
            });
          }
        }
        return acc;
      }, []) ?? []
    );
  }

  /**
   * Переходим к следующему шагу создания ЭЦП (используется при выпуске ЭЦП от WiseAdvice по логину и паролю).
   */
  nextStep() {
    this.nextStepClickedSignal.set(true);
  }
}
