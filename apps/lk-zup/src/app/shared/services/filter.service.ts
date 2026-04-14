import { Injectable } from '@angular/core';
import { BlurDialogHandlerOptionsInterface } from '@shared/interfaces/dialog/blur-dialog-handler-options.interface';
import { getAncestors } from '@shared/utils/DOM/common';
import { bindAppend } from '@shared/utils/object/function';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  /**
   * Добавляем обработчик события 'click' к глобальному объекту window, чтобы определить момент, когда пользователь нажал
   * мимо диалогового окна с фильтрами и выполнить при этом необходимые действия, например: закрывать диалоговое окно с
   * фильтрами всякий раз при нажатии мимо этого окна.
   *
   * @param blurCallback функция обратного вызова, срабатывающая при выполнении условия нажатия мимо диалогового окна.
   * @param options (необязательный параметр) опции
   * @returns {() => void} – clickHandler (обработчик нажатия мимо диалогового окна)
   */
  addClickOutsideFiltersDialogEventListener(
    blurCallback: () => any,
    options: BlurDialogHandlerOptionsInterface = {}
  ): () => void {
    const clickHandler: () => void = bindAppend(
      this.blurDialogHandler,
      null,
      blurCallback,
      options
    );

    window.addEventListener('click', clickHandler, true);

    return clickHandler;
  }

  /**
   * Обработчик нажатия мимо диалогового окна (в основном используется для его закрытия).
   *
   * @param event событие нажатия ('click') мимо диалогового окна
   * @param blurCallback функция обратного вызова, срабатывающая при выполнении условия нажатия мимо диалогового окна.
   * @param options (необязательный параметр) опции
   */
  blurDialogHandler(
    event: MouseEvent,
    blurCallback: () => any,
    options: BlurDialogHandlerOptionsInterface
  ): void {
    const dialogClass: string = options?.dialogClass || 'filters-dialog';
    const exceptElementClasses: string[] = options?.exceptElementClasses;
    const target: HTMLElement = event.target as HTMLElement;

    const ancestors: HTMLElement[] = getAncestors(target, {
      stopElementClass: dialogClass,
    });

    const isExceptElement: boolean = exceptElementClasses?.some((c: string) => target.classList.contains(c));
    const isExceptElementDescendant: boolean = ancestors.some((el: HTMLElement) =>
      exceptElementClasses?.some((c: string) => el.classList.contains(c))
    );

    // Проверяем, не произведено ли нажатие на элемент-исключение (или его потомок), при котором не нужно вызывать blurCallback.
    if (isExceptElement || isExceptElementDescendant) {
      return;
    }

    const isDialog: boolean = target.classList.contains(dialogClass);
    const isDialogDescendant: boolean = ancestors.some((el: HTMLElement) =>
      el.classList.contains(dialogClass)
    );

    /**
     * Условие определения нажатия мимо диалогового окна с фильтрами с целью последующего закрытия этого окна
     * (и/или выполнения иного действия, указанного в blurCallback).
     *
     * Если пользователь нажал на сам диалог или на какой-либо HTML-элемент, являющийся потомком этого диалога, то
     * оставляем диалоговое окно с фильтрами, в противном случае — закрываем.
     *
     * (!) Для того чтобы это условие работало для оверлеев [overlay] (выпадающих панелек) PrimeNG-фильтров и для
     * любых находящихся в них элементов управления, желательно убедиться, что для соответствующего PrimeNG-элемента
     * (например, p-multiSelect) не установлен атрибут (входное свойство) "appendTo" (в большинстве случаев при
     * установке этого свойства оверлей перестаёт быть потомком диалогового окна с фильтрами, поскольку
     * привязывается к элементу, который не является потомком элемента с CSS-классом 'filters-dialog').
     */
    const blurCondition: boolean = !isDialog && !isDialogDescendant;

    if (blurCondition) {
      blurCallback();
    }
  }
}
