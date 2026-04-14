import { Injectable, signal, WritableSignal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { CommunicationEvent } from '@shared/interfaces/event/communication-event.interface';
import get from 'lodash/get';
import set from 'lodash/set';
import { firstValueFrom, Observable, BehaviorSubject } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

// FIXME: УДАЛИТЬ ЭТО ДЕРЬМО ПРИ РЕФАКТОРИНГЕ
/**
 * Сервис-посредник для коммуникации (общения/взаимодействия) между компонентами/сервисами и другими отдельно взятыми
 * сущностями приложения. Можно рассматривать его как телефон или рацию (средство общения) для указанных сущностей.
 *
 * Нужен в первую очередь для избежания появления circular dependencies (циклических ["круговых"] зависимостей).
 */
@Injectable({ providedIn: 'root' })
export class CommunicationService {
  eventsSubj = new BehaviorSubject<CommunicationEvent[]>([]);
  events$ = this.eventsSubj.asObservable();

  eventsSignal = toSignal(this.eventsSubj);

  /**
   * Последнее (в смысле "самое свежее") событие коммуникации в виде Observable.
   */
  event$: Observable<CommunicationEvent> = this.events$.pipe(
    filter((events) => !!events.length),
    map((events) => events[events.length - 1]),
  );

  /**
   * Последнее (в смысле "самое свежее") событие коммуникации в виде Observable, предназначенное для конкретного
   * получателя.
   *
   * @param toName имя получателя (например, название компонента или сервиса).
   */
  eventFor$(toName: string): Observable<CommunicationEvent> {
    return this.event$.pipe(filter((e) => e.to?.name === toName));
  }

  /**
   * Получаем событие коммуникации по его id.
   * @param id идентификатор события коммуникации
   */
  getEventById(id: number): CommunicationEvent {
    const events: CommunicationEvent[] = this.eventsSignal();
    return events.find((e) => e.id === id);
  }

  /**
   * Устанавливаем новое значение для свойства объекта события коммуникации.
   *
   * @param e событие коммуникации (общения/взаимодействия)
   * @param keyPath путь к ключу свойства объекта (события коммуникации)
   * @param value значение, которое хотим установить для свойства
   */
  setEventProperty(e: CommunicationEvent, keyPath: string, value: any): void {
    set(e, keyPath, value);
  }

  getEventProperty(e: CommunicationEvent, keyPath: string): any {
    return get(e, keyPath);
  }

  /**
   * Отправляем новое событие коммуникации.
   *
   * @param event событие коммуникации (общения/взаимодействия)
   * @returns {number} id отправленного события
   */
  sendEvent(event: CommunicationEvent): number {
    event.id = this.eventsSignal().length + 1;
    event.timestampFrom = new Date().getTime();

    this.eventsSubj.next([...this.eventsSubj.value, event]);

    return event.id;
  }

  /**
   * Получаем событие ответа по id события запроса на выполнение действия.
   *
   * @param requestEventId идентификатор (id) события запроса
   * @returns событие ответа на запрос выполнения действия
   */
  async getResponseEvent(requestEventId: number): Promise<CommunicationEvent> {
    const events: CommunicationEvent[] = this.eventsSignal();
    const matchedResultEvent: CommunicationEvent = events.find(
      (e) => e.requestEventId === requestEventId,
    );

    if (matchedResultEvent) return matchedResultEvent;

    return firstValueFrom(
      this.event$.pipe(
        filter((e: CommunicationEvent) => e.requestEventId === requestEventId),
        take(1),
      ),
    );
  }

  /**
   * Получаем события ответа по id соответствующих им событий запроса.
   *
   * @param ids массив id событий коммуникации
   * @returns результирующее событие, содержащее результат запрошенного по id события
   */
  async getResultEventsByIds(ids: number[]): Promise<CommunicationEvent[]> {
    return firstValueFrom(
      this.events$.pipe(
        filter(
          (events) =>
            !!events.length &&
            ids.every((id) => events.find((e) => e.id === id)),
        ),
        take(1),
      ),
    );
  }

  /**
   * Обрабатываем событие коммуникации.
   *
   * @param e событие коммуникации
   * @param toRef ссылка на получателя события (например, ссылка на экземпляр компонента или сервиса)
   */
  async processEvent(
    e: CommunicationEvent,
    toRef: any,
  ): Promise<CommunicationEvent> {
    // устанавливаем метку времени получения события
    e.timestampTo = new Date().getTime();

    if (e.type === 'req') {
      // устанавливаем для события ссылку на получателя, чтобы можно было выполнить действие получателем прямо из
      // коммуникатора (сервиса коммуникации) без необходимости передавать параметр toRef в качестве аргумента
      // вспомогательным функциям
      this.setEventProperty(e, 'to.ref', toRef);

      const responseEvent: CommunicationEvent =
        await this.processActionRequestEvent(e);

      // очищаем ссылку на получателя по окончании обработки запроса на выполнение действия
      this.setEventProperty(e, 'to.ref', null);

      return responseEvent;
    }

    return e;
  }

  /**
   * Обрабатываем событие запроса на выполнение действия (например, ждём результата вызова асинхронной функции).
   *
   * @param e событие коммуникации
   */
  private async processActionRequestEvent(
    e: CommunicationEvent,
  ): Promise<CommunicationEvent> {
    const responseEvent: CommunicationEvent = {
      type: 'res',
      requestEventId: e.id,
    };

    if (e.action?.type === 'call') {
      responseEvent.result = await this.callFnByEvent(e);
    }

    this.sendEvent(responseEvent);

    return responseEvent;
  }

  /**
   * Вызываем функцию получателя по переданному событию коммуникации.
   * @param e событие коммуникации
   */
  private async callFnByEvent(e: CommunicationEvent): Promise<any> {
    return e.to.ref[e.fn.name].apply(e.fn.thisArg || e.to.ref, e.fn.args);
  }

  /**
   * Удаляем событие коммуникации по его id.
   *
   * @param id идентификатор события коммуникации.
   */
  removeEventById(id: number): void {
    this.eventsSubj.next(this.eventsSubj.value.filter((e) => e.id !== id));
  }

  /**
   * Удаляем события коммуникации по их id.
   */
  removeEventsByIds(ids: number[]): void {
    for (const id of ids) {
      this.removeEventById(id);
    }
  }

  /**
   * Очищаем массив событий коммуникации.
   */
  clearEvents(): void {
    this.eventsSubj.next([]);
  }
}
